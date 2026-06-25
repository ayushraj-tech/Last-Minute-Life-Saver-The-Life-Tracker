// Zero-dependency native Web Audio API Ambient & Alarm synthesizer
// This generates lush, highly professional audio procedurally in the browser,
// ensuring there are no 404 missing audio asset errors in the preview frame.

class AudioEngineClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSource: { stop: () => void } | null = null;
  private currentSound: 'none' | 'lofi' | 'nature' | 'rain' | 'ambient' = 'none';
  private isPlaying: boolean = false;
  private masterVolume: number = 0.5;

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.error('AudioContext failed to initialize:', e);
    }
  }

  public getContext(): AudioContext | null {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playSessionEndChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Beautiful double-bell wellness chime: A5 (880Hz) followed by C#6 (1108.73Hz)
    this.triggerBellTone(ctx, 880, now, 1.5);
    this.triggerBellTone(ctx, 1108.73, now + 0.35, 2.0);
  }

  private triggerBellTone(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    // Principal tone (Sine for purity)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmonic fifth (Triangle for elegant metallic chime resonance)
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, startTime);

    // Principal volume envelope
    gain1.gain.setValueAtTime(0, startTime);
    gain1.gain.linearRampToValueAtTime(0.25, startTime + 0.05); // sharp but pleasant attack
    gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Harmonic volume envelope (decays faster for natural chime decay)
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(0.06, startTime + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

    // Lowpass filter to keep the chime sweet and non-harsh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, startTime);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(filter);
    gain2.connect(filter);
    
    filter.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);

    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  public setSound(sound: 'none' | 'lofi' | 'nature' | 'rain' | 'ambient') {
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.currentSound === sound && this.isPlaying) return;

    this.stop();
    this.currentSound = sound;

    if (sound === 'none') return;

    this.isPlaying = true;
    const dest = this.masterGain || ctx.destination;

    if (sound === 'rain') {
      this.currentSource = this.startRain(ctx, dest);
    } else if (sound === 'nature') {
      this.currentSource = this.startNature(ctx, dest);
    } else if (sound === 'lofi') {
      this.currentSource = this.startLofi(ctx, dest);
    } else if (sound === 'ambient') {
      this.currentSource = this.startAmbient(ctx, dest);
    }
  }

  public stop() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
    this.isPlaying = false;
    this.currentSound = 'none';
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.masterVolume, this.ctx.currentTime + 0.1);
    }
  }

  private createNoiseBuffer(ctx: AudioContext, duration: number = 2.0): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Heavy Rain Synthesis
  private startRain(ctx: AudioContext, dest: AudioNode): { stop: () => void } {
    const noise = this.createNoiseBuffer(ctx, 2.0);
    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.65, ctx.currentTime);

    source.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(dest);

    source.start(0);

    // Randomized dripping sound intervals
    const dripInterval = setInterval(() => {
      if (!this.isPlaying || this.currentSound !== 'rain') {
        clearInterval(dripInterval);
        return;
      }
      if (Math.random() > 0.3) {
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();

        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(1200 + Math.random() * 700, ctx.currentTime);
        dropOsc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);

        dropGain.gain.setValueAtTime(0.04 * Math.random(), ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

        dropOsc.connect(dropGain);
        dropGain.connect(dest);

        dropOsc.start();
        dropOsc.stop(ctx.currentTime + 0.05);
      }
    }, 140);

    return {
      stop: () => {
        try { source.stop(); } catch (e) {}
        clearInterval(dripInterval);
      }
    };
  }

  // 2. Forest Nature Synthesis (Slow wind rustle & elegant bird/cricket chirps)
  private startNature(ctx: AudioContext, dest: AudioNode): { stop: () => void } {
    const noise = this.createNoiseBuffer(ctx, 3.0);
    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.5, ctx.currentTime);
    filter.frequency.setValueAtTime(250, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.45, ctx.currentTime);

    source.connect(filter);
    filter.connect(windGain);
    windGain.connect(dest);

    source.start(0);

    // Slowly modulate the bandpass frequency to simulate shifting natural wind
    let sweepAngle = 0;
    const windSweep = setInterval(() => {
      sweepAngle += 0.08;
      const freq = 240 + Math.sin(sweepAngle) * 80;
      if (this.ctx) {
        filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
      }
    }, 100);

    // Soft, realistic forest chirps
    const chirpInterval = setInterval(() => {
      if (!this.isPlaying || this.currentSound !== 'nature') {
        clearInterval(chirpInterval);
        clearInterval(windSweep);
        return;
      }
      if (Math.random() > 0.4) {
        const now = ctx.currentTime;
        const chirpOsc = ctx.createOscillator();
        const chirpGain = ctx.createGain();

        chirpOsc.type = 'sine';
        const startFreq = 2500 + Math.random() * 500;
        chirpOsc.frequency.setValueAtTime(startFreq, now);
        chirpOsc.frequency.exponentialRampToValueAtTime(startFreq + 300, now + 0.06);

        chirpGain.gain.setValueAtTime(0, now);
        chirpGain.gain.linearRampToValueAtTime(0.015, now + 0.02);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        chirpOsc.connect(chirpGain);
        chirpGain.connect(dest);

        chirpOsc.start(now);
        chirpOsc.stop(now + 0.14);
      }
    }, 2200);

    return {
      stop: () => {
        try { source.stop(); } catch (e) {}
        clearInterval(windSweep);
        clearInterval(chirpInterval);
      }
    };
  }

  // 3. Relaxing Lofi Chill Synthesizer (Chords, soft beat & dust crackle)
  private startLofi(ctx: AudioContext, dest: AudioNode): { stop: () => void } {
    // Continuous subtle dust crackle
    const noise = this.createNoiseBuffer(ctx, 1.5);
    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = noise;
    crackleSource.loop = true;

    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = 'highpass';
    crackleFilter.frequency.setValueAtTime(1800, ctx.currentTime);

    const crackleGain = ctx.createGain();
    crackleGain.gain.setValueAtTime(0.012, ctx.currentTime);

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(dest);
    crackleSource.start(0);

    // Mellow Chord voices: Am9 - D9 - Gmaj9 - Cmaj9
    const progressions = [
      [110, 261.63, 329.63, 392, 493.88], // Am9 (A2, C4, E4, G4, B4)
      [73.42, 185, 261.63, 329.63, 493.88], // D13/D9 (D2, F#3, C4, E4, B4)
      [98, 246.94, 293.66, 369.99, 440], // Gmaj9 (G2, B3, D4, F#4, A4)
      [130.81, 164.81, 196, 246.94, 293.66] // Cmaj9 (C3, E3, G3, B3, D4)
    ];

    let progressionIndex = 0;
    const playChords = () => {
      const t = ctx.currentTime;
      const duration = 3.6;
      const chord = progressions[progressionIndex];

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Deep bass voice uses warm sine, upper voicings use triangle for Rhodes feel
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        const chordFilter = ctx.createBiquadFilter();
        chordFilter.type = 'lowpass';
        chordFilter.frequency.setValueAtTime(i === 0 ? 250 : 680, t);

        const maxVol = i === 0 ? 0.14 : 0.045;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(maxVol, t + 0.5); // slow cozy attack
        gain.gain.setValueAtTime(maxVol, t + duration - 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

        osc.connect(chordFilter);
        chordFilter.connect(gain);
        gain.connect(dest);

        osc.start(t);
        osc.stop(t + duration);
      });
    };

    playChords();

    const chordLoop = setInterval(() => {
      if (!this.isPlaying || this.currentSound !== 'lofi') {
        clearInterval(chordLoop);
        return;
      }
      progressionIndex = (progressionIndex + 1) % progressions.length;
      playChords();
    }, 4000);

    // Warm, muted hiphop drum beat
    let beatStep = 0;
    const playLofiDrum = () => {
      const t = ctx.currentTime;

      // Deep kick on steps 0 and 2
      if (beatStep === 0 || beatStep === 2) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(110, t);
        kickOsc.frequency.exponentialRampToValueAtTime(42, t + 0.14);

        kickGain.gain.setValueAtTime(0.24, t);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

        kickOsc.connect(kickGain);
        kickGain.connect(dest);

        kickOsc.start(t);
        kickOsc.stop(t + 0.18);
      }

      // Cozy soft snare on steps 1 and 3
      if (beatStep === 1 || beatStep === 3) {
        const snareOsc = ctx.createOscillator();
        const snareGain = ctx.createGain();

        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(190, t);
        snareOsc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

        snareGain.gain.setValueAtTime(0.07, t);
        snareGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

        snareOsc.connect(snareGain);
        snareGain.connect(dest);

        snareOsc.start(t);
        snareOsc.stop(t + 0.13);
      }

      beatStep = (beatStep + 1) % 4;
    };

    const beatLoop = setInterval(() => {
      if (!this.isPlaying || this.currentSound !== 'lofi') {
        clearInterval(beatLoop);
        return;
      }
      playLofiDrum();
    }, 1000);

    return {
      stop: () => {
        try { crackleSource.stop(); } catch (e) {}
        clearInterval(chordLoop);
        clearInterval(beatLoop);
      }
    };
  }

  // 4. Cosmic Ambient Synthesizer (Dreamy evolving space drone)
  private startAmbient(ctx: AudioContext, dest: AudioNode): { stop: () => void } {
    const baseFreqs = [130.81, 196.00, 246.94, 293.66, 392.00]; // Rich, beautiful open C major 9 drone voicing
    const oscillators: OscillatorNode[] = [];
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.12, ctx.currentTime);

    filter.connect(padGain);
    padGain.connect(dest);

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Mix soft pure sines and triangles to achieve warm, vintage ambient character
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      
      // Introduce subtle random detuning to widen the cosmic soundstage organically
      const organicDetune = freq + (Math.random() - 0.5) * 1.8;
      osc.frequency.setValueAtTime(organicDetune, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(0);

      oscillators.push(osc);
    });

    // Slowly sweep the cutoff frequency of the lowpass filter to make it "breathe"
    let modAngle = 0;
    const sweep = setInterval(() => {
      modAngle += 0.04;
      const cutoff = 220 + Math.sin(modAngle) * 120;
      if (this.ctx) {
        filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
        // Subtle pitch drift to simulate vintage analog circuitry warp
        oscillators.forEach((osc, idx) => {
          const drift = Math.sin(modAngle * 0.4 + idx) * 0.45;
          osc.frequency.setValueAtTime(baseFreqs[idx] + drift, this.ctx.currentTime);
        });
      }
    }, 40);

    return {
      stop: () => {
        oscillators.forEach((osc) => {
          try { osc.stop(); } catch (e) {}
        });
        clearInterval(sweep);
      }
    };
  }
}

export const audioEngine = new AudioEngineClass();
