import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  angle?: number;
  speed?: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: boolean;
  glowTimer: number;
}

export const BackgroundSimulation: React.FC = () => {
  const { activeTheme, activeSimulation } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Mouse tracking
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  // Refs for animation states to prevent unnecessary re-runs
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const matrixRef = useRef<{ columns: number; drops: number[]; fontSize: number } | null>(null);

  // ResizeObserver implementation according to canvas sizing guidelines
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeTimeout: any = null;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;

      // Debounce resize to preserve performance on rapid window snapping/resizing
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDimensions({ width, height });
      }, 100);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  // Sync canvas size on dimension changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Reset matrix rain state when dimensions change
    if (activeSimulation === 'digitalRain' || activeTheme === 'cyber') {
      const fontSize = 14;
      const columns = Math.ceil(dimensions.width / fontSize);
      const drops = Array(columns).fill(0).map(() => Math.random() * -dimensions.height);
      matrixRef.current = { columns, drops, fontSize };
    }

    // Initialize Neural network nodes when dimensions change
    if (activeSimulation === 'neural') {
      const nodeCount = Math.min(45, Math.floor((dimensions.width * dimensions.height) / 22000));
      const nodes: Node[] = [];
      const colors = getThemeColors();
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: Math.random() * 2 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          glow: false,
          glowTimer: 0,
        });
      }
      nodesRef.current = nodes;
    }
  }, [dimensions, activeSimulation, activeTheme]);

  // Color helper based on theme
  const getThemeColors = () => {
    switch (activeTheme) {
      case 'glass-light':
        return ['#0ea5e9', '#6366f1', '#8b5cf6', '#3b82f6', '#ec4899']; // Deeper blue, Indigo, Violet for contrast
      case 'gradient-light':
        return ['#f97316', '#fb7185', '#3b82f6', '#f59e0b', '#0ea5e9']; // Vibrant peach, soft rose, warm gold
      case 'basic':
      default:
        return ['#94a3b8', '#cbd5e1', '#64748b', '#3b82f6', '#475569']; // Soft slate, minimalist blues
    }
  };

  // Trigger Burst of Particles on Click or programmatic call
  const triggerBurst = (x: number, y: number, count: number = 20) => {
    const colors = getThemeColors();
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.5;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // Trigger Ripple on Click
  const triggerRipple = (x: number, y: number) => {
    const colors = getThemeColors();
    const primaryColor = colors[0];
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 150 + 100,
      speed: Math.random() * 2 + 2,
      color: primaryColor,
      alpha: 0.8,
      lineWidth: 3,
    });
  };

  // Event Handlers for Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Always trigger a beautiful burst of particles on click
      triggerBurst(clickX, clickY, 15);

      // Trigger simulation specific effects
      if (activeSimulation === 'ripples') {
        triggerRipple(clickX, clickY);
      } else if (activeSimulation === 'neural') {
        // Find nearest nodes and activate their glow
        nodesRef.current.forEach(node => {
          const dist = Math.hypot(node.x - clickX, node.y - clickY);
          if (dist < 150) {
            node.glow = true;
            node.glowTimer = 60; // 60 frames of glow
            node.vx += (node.x - clickX) * 0.05;
            node.vy += (node.y - clickY) * 0.05;
          }
        });
      } else if (activeSimulation === 'orbits') {
        // Pull particles inward with a burst
        particlesRef.current.forEach(p => {
          const dx = clickX - p.x;
          const dy = clickY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 300) {
            p.vx += (dx / dist) * 2;
            p.vy += (dy / dist) * 2;
          }
        });
      }
    };

    // Attach to window so clicks on buttons also trigger visual propagation behind them
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleCanvasClick);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleCanvasClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeSimulation, activeTheme]);

  // Animation Loop Hook
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Draw background base fade
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      const colors = getThemeColors();
      const mouse = mouseRef.current;
      const activeGravityX = mouse.active ? mouse.x : w / 2;
      const activeGravityY = mouse.active ? mouse.y : h / 2;

      // 1. SIMULATION: ORBITS & GRAVITY
      if (activeSimulation === 'orbits') {
        // Periodically emit tiny floating dust particles
        if (particlesRef.current.length < 150 && Math.random() < 0.4) {
          const startX = Math.random() * w;
          const startY = Math.random() * h;
          particlesRef.current.push({
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.1,
            life: 0,
            maxLife: Math.random() * 200 + 100,
          });
        }

        particlesRef.current.forEach((p, idx) => {
          // Calculate gravity pull toward cursor or center
          const dx = activeGravityX - p.x;
          const dy = activeGravityY - p.y;
          const dist = Math.hypot(dx, dy) || 1;

          // Pull force is inversely proportional to distance, capped for stability
          const force = Math.min(0.12, 12 / dist);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;

          // Drag
          p.vx *= 0.98;
          p.vy *= 0.98;

          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          // Draw orbital trace
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          const currentAlpha = Math.max(0, p.alpha * (1 - p.life / p.maxLife));
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.fill();
        });

        // Filter out dead particles
        particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      }

      // 2. SIMULATION: FLUID RIPPLES
      if (activeSimulation === 'ripples') {
        // Ambient automatic slow wave emission
        if (ripplesRef.current.length < 5 && Math.random() < 0.015) {
          triggerRipple(Math.random() * w, Math.random() * h);
        }

        ripplesRef.current.forEach((rip) => {
          rip.radius += rip.speed;
          rip.alpha = 1 - (rip.radius / rip.maxRadius);

          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = rip.color;
          ctx.lineWidth = rip.lineWidth * rip.alpha;
          ctx.globalAlpha = Math.max(0, rip.alpha * 0.15); // Calm low opacity
          ctx.stroke();
        });

        ripplesRef.current = ripplesRef.current.filter(rip => rip.radius < rip.maxRadius);
      }

      // 3. SIMULATION: NEURAL NETWORK
      if (activeSimulation === 'neural' && nodesRef.current.length > 0) {
        const nodes = nodesRef.current;

        // Move and draw nodes
        nodes.forEach((node) => {
          node.x += node.vx;
          node.y += node.vy;

          // Soft bounce boundaries
          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;

          // Mouse influence (slight hover pull)
          if (mouse.active) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 180) {
              const pull = (180 - dist) * 0.0003;
              node.vx += dx * pull;
              node.vy += dy * pull;
            }
          }

          // Friction to keep speed reasonable
          const speed = Math.hypot(node.vx, node.vy);
          if (speed > 2.5) {
            node.vx *= 0.95;
            node.vy *= 0.95;
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.glow ? node.radius * 2 : node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = node.glow ? 0.8 : 0.35;
          ctx.fill();

          if (node.glow) {
            ctx.shadowColor = node.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.globalAlpha = 0.15;
            ctx.fill();
            ctx.shadowBlur = 0; // reset

            node.glowTimer--;
            if (node.glowTimer <= 0) node.glow = false;
          }
        });

        // Draw connect lines
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];
            const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.12;
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = n1.color;
              ctx.lineWidth = 1;
              ctx.globalAlpha = alpha;
              ctx.stroke();
            }
          }
        }
      }

      // 4. SIMULATION: DIGITAL CYBER RAIN (Matrix columns)
      if (activeSimulation === 'digitalRain' && matrixRef.current) {
        const { columns, drops, fontSize } = matrixRef.current;

        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
          const x = i * fontSize;
          const headY = drops[i];

          // Draw head and trail characters
          const trailLength = 12;
          for (let j = 0; j < trailLength; j++) {
            const charY = headY - (j * fontSize);
            // Skip drawing if above viewport
            if (charY < -fontSize) continue;
            // Skip drawing if below viewport
            if (charY > h + fontSize) break;

            const ageRatio = j / trailLength; // 0 (head) to 1 (end of trail)
            const char = Math.random() > 0.55 ? '1' : '0';
            
            // Head is bright white, trails are theme colors with fading alpha
            if (j === 0) {
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = 0.45;
            } else {
              ctx.fillStyle = colors[i % colors.length];
              ctx.globalAlpha = (1 - ageRatio) * 0.18; // Fading trailing alpha
            }

            ctx.fillText(char, x, charY);
          }

          // If drop goes past bottom, reset to top
          if (headY > h && Math.random() > 0.975) {
            drops[i] = -fontSize * (Math.random() * 15);
          } else {
            drops[i] += fontSize * 0.42; // Soft smooth rain speed
          }
        }
      }

      // 4b. SIMULATION: CINEMATIC ORGANIC FLUID WAVES
      if (activeSimulation === 'waves') {
        const timeOffset = Date.now() * 0.0006; // Slow calming tempo
        const waveCount = 3;
        
        for (let i = waveCount - 1; i >= 0; i--) {
          const baseHeight = h * 0.70 + (i * 28); // staggered base height positions
          const amplitude = 35 - (i * 9); // height amplitudes
          const frequency = 0.0018 + (i * 0.0008); // dynamic crest separation widths
          const phase = timeOffset + (i * Math.PI / 2.5); // overlapping crest phase shifts
          
          const points: { x: number; y: number }[] = [];
          
          // Generate wave points list
          for (let x = 0; x <= w; x += 8) {
            let y = baseHeight + Math.sin(x * frequency + phase) * amplitude;
            
            // Subtle fractal overlay micro-waves
            y += Math.cos(x * 0.012 - timeOffset * 1.8) * (4 - i * 1.0);
            
            // Mouse dynamic magnetic elastic ripple pull
            if (mouse.active) {
              const dx = mouse.x - x;
              const dy = mouse.y - y;
              const dist = Math.hypot(dx, dy);
              if (dist < 250) {
                const force = (250 - dist) * 0.22 * Math.sin(dist * 0.04 - timeOffset * 3);
                y += force;
              }
            }
            points.push({ x, y });
          }

          // 1. Draw solid gradient fill path
          ctx.beginPath();
          ctx.moveTo(0, h);
          points.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(w, h);
          ctx.closePath();
          
          // Smooth vertical visual transition gradient mapping
          const gradient = ctx.createLinearGradient(0, baseHeight - amplitude - 15, 0, h);
          const primaryColor = colors[i % colors.length];
          
          gradient.addColorStop(0, primaryColor + '1e'); // Slight transparent opacity at crest
          gradient.addColorStop(0.5, primaryColor + '08'); // Lower opacity midway
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 1;
          ctx.fill();
          
          // 2. Stroke the crest outline directly using the exact same calculated points
          ctx.beginPath();
          points.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.strokeStyle = primaryColor + '40'; // High contrast, elegant outline
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // 5. CLICK SPLASH PARTICLES DRAWING (Always running for burst interactions)
      if (particlesRef.current.length > 0) {
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          // Apply gravity decay
          p.vy += 0.03;
          p.life++;

          const ageRatio = p.life / p.maxLife;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - ageRatio * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, (1 - ageRatio) * 0.8);
          ctx.fill();
        });

        particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      }

      // Reset transparency
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSimulation, activeTheme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-500 ${
          activeTheme === 'glass-light' ? 'opacity-85' : 'opacity-60'
        }`}
      />
    </div>
  );
};
