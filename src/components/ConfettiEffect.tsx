import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotate: number;
  scale: number;
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const ConfettiEffect: React.FC<{ active: boolean; onComplete: () => void }> = ({ active, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const generated: Particle[] = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage width
        y: -10 - Math.random() * 20, // offset above screen
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 6,
        rotate: Math.random() * 360,
        scale: Math.random() * 0.6 + 0.5,
      }));

      setParticles(generated);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: `${p.x}vw`, 
              y: `${p.y}vh`, 
              rotate: p.rotate, 
              scale: p.scale,
              opacity: 1 
            }}
            animate={{ 
              y: '110vh', 
              x: `${p.x + (Math.random() * 20 - 10)}vw`,
              rotate: p.rotate + 720,
              opacity: [1, 1, 0.8, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: Math.random() * 2.5 + 2, 
              ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
