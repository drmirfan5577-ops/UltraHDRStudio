import React, { useRef, useEffect } from 'react';

interface Props {
  type: string;
  active: boolean;
}

type DrawFn = (ctx: CanvasRenderingContext2D, W: number, H: number, frame: number) => void;

const CANVAS_EFFECTS: Record<string, DrawFn> = {
  'particle-galaxy': (ctx, W, H, frame) => {
    ctx.fillStyle = 'rgba(5,8,20,0.15)';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) {
      const t = frame * 0.012 + i * 2.09;
      const x = W / 2 + Math.cos(t) * (W * 0.3 + Math.sin(t * 0.7) * W * 0.1);
      const y = H / 2 + Math.sin(t * 0.8) * (H * 0.3 + Math.cos(t * 0.5) * H * 0.1);
      const r = 2 + Math.sin(frame * 0.05 + i) * 1;
      const hue = (frame * 0.5 + i * 120) % 360;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},80%,65%,0.9)`;
      ctx.fill();
      ctx.shadowColor = `hsla(${hue},100%,60%,1)`;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    // Floating particles
    for (let i = 0; i < 30; i++) {
      const seed = i * 137.5;
      const px = ((seed * 71 + frame * (0.1 + (i % 5) * 0.05)) % W + W) % W;
      const py = ((seed * 53 + frame * (0.07 + (i % 3) * 0.03)) % H + H) % H;
      const hue = (seed + frame) % 360;
      ctx.beginPath();
      ctx.arc(px, py, 0.8 + Math.sin(frame * 0.05 + i) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},70%,70%,0.7)`;
      ctx.fill();
    }
  },

  'matrix-rain': (ctx, W, H, frame) => {
    ctx.fillStyle = 'rgba(0,10,2,0.1)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = '13px monospace';
    const cols = Math.floor(W / 14);
    const chars = '01アイウエオカキクケコサシスセソタチツテト0101010110';
    for (let i = 0; i < cols; i++) {
      const speed = 0.5 + (i % 7) * 0.3;
      const y = ((frame * speed + i * 37) % (H + 100)) - 20;
      const alpha = 0.3 + Math.sin(frame * 0.05 + i) * 0.2;
      const charIdx = Math.floor((frame * speed * 0.3 + i) % chars.length);
      ctx.fillStyle = `rgba(0,${180 + i % 50},${50 + i % 40},${alpha})`;
      if (y < 0) continue;
      ctx.fillText(chars[charIdx], i * 14, y);
      // Bright head
      ctx.fillStyle = `rgba(100,255,100,${alpha * 2})`;
      ctx.fillText(chars[(charIdx + 1) % chars.length], i * 14, y - 14);
    }
  },

  'aurora-waves': (ctx, W, H, frame) => {
    ctx.fillStyle = 'rgba(5,8,20,0.05)';
    ctx.fillRect(0, 0, W, H);
    const waves = [
      { color: [16, 185, 129], freq: 0.012, amp: 0.12, speed: 0.008, yBase: 0.4 },
      { color: [6, 182, 212], freq: 0.009, amp: 0.1, speed: 0.006, yBase: 0.5 },
      { color: [139, 92, 246], freq: 0.015, amp: 0.09, speed: 0.01, yBase: 0.35 },
    ];
    waves.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 3) {
        const y = H * w.yBase + Math.sin(x * w.freq + frame * w.speed) * H * w.amp
          + Math.sin(x * w.freq * 2.1 + frame * w.speed * 0.7) * H * w.amp * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `rgba(${w.color.join(',')},0.5)`);
      grad.addColorStop(1, 'rgba(5,8,20,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    });
  },

  'crystal-grid': (ctx, W, H, frame) => {
    ctx.fillStyle = 'rgba(5,8,20,0.08)';
    ctx.fillRect(0, 0, W, H);
    const gridSize = 40;
    const cols = Math.ceil(W / gridSize) + 1;
    const rows = Math.ceil(H / gridSize) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * gridSize + ((frame * 0.2) % gridSize);
        const y = r * gridSize + ((frame * 0.15) % gridSize);
        const dist = Math.sqrt(Math.pow(x - W / 2, 2) + Math.pow(y - H / 2, 2));
        const pulse = Math.sin(dist * 0.02 - frame * 0.05) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(6,182,212,${0.05 + pulse * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x - gridSize / 2, y - gridSize / 2, gridSize, gridSize);
        if (pulse > 0.7) {
          ctx.fillStyle = `rgba(139,92,246,${(pulse - 0.7) * 0.5})`;
          ctx.beginPath();
          ctx.arc(x, y, 2 * pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  },

  'hologram': (ctx, W, H, frame) => {
    ctx.fillStyle = 'rgba(5,8,20,0.12)';
    ctx.fillRect(0, 0, W, H);
    // Scan lines
    for (let y = 0; y < H; y += 4) {
      const alpha = 0.02 + Math.sin(y * 0.1 + frame * 0.05) * 0.01;
      ctx.fillStyle = `rgba(6,182,212,${alpha})`;
      ctx.fillRect(0, y, W, 1.5);
    }
    // Concentric rings
    for (let i = 0; i < 5; i++) {
      const r = (50 + i * 60 + (frame * 1.5 + i * 40) % 300);
      const alpha = Math.max(0, 0.3 - r / 400);
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Cross
    ctx.strokeStyle = `rgba(6,182,212,${0.1 + Math.sin(frame * 0.03) * 0.05})`;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([5, 15]);
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    ctx.setLineDash([]);
  },
};

const CanvasBackgroundRenderer: React.FC<Props> = ({ type, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFn = CANVAS_EFFECTS[type];
    if (!drawFn) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      frameRef.current++;
      drawFn(ctx, canvas.width, canvas.height, frameRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [type, active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.7, mixBlendMode: 'screen' }}
    />
  );
};

export const CANVAS_BG_OPTIONS = [
  { id: 'particle-galaxy', name: '✨ Particle Galaxy', desc: 'Floating luminous particles orbit in deep space' },
  { id: 'matrix-rain', name: '💚 Matrix Rain', desc: 'Digital green character rain cascade' },
  { id: 'aurora-waves', name: '🌈 Aurora Waves', desc: 'Flowing northern lights wave forms' },
  { id: 'crystal-grid', name: '🔷 Crystal Grid', desc: 'Pulsing 3D holographic grid lattice' },
  { id: 'hologram', name: '🔵 Hologram Scan', desc: 'Sci-fi concentric hologram projection' },
];

export default CanvasBackgroundRenderer;
