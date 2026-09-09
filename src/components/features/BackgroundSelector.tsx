import React from 'react';
import { BACKGROUNDS_3D } from '@/constants/features';

interface Props {
  activeBackground: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}

const BackgroundSelector: React.FC<Props> = ({ activeBackground, onClose, onSelect }) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-purple-300 glow-text-purple">🌌 3D/4D Backgrounds</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>
      <p className="text-white/50 text-xs">30+ Live Dynamic Backgrounds — Crystal Clear Ultra HD</p>
      <div className="grid grid-cols-2 gap-3">
        {BACKGROUNDS_3D.map(bg => (
          <button
            key={bg.id}
            onClick={() => onSelect(bg.id)}
            className={`relative rounded-xl overflow-hidden h-20 transition-all ${activeBackground === bg.id ? 'ring-2 ring-purple-400 scale-105' : 'hover:scale-102 hover:ring-1 hover:ring-white/30'}`}
            style={{ background: bg.gradient }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {activeBackground === bg.id && (
                <span className="text-white text-lg">✓</span>
              )}
              <span className="text-white text-xs font-semibold mt-1 text-center px-1 bg-black/30 rounded px-2">
                {bg.name}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-yellow-300 text-xs font-bold">✨ Animation Features</p>
        <div className="flex flex-wrap gap-1">
          {['Live Dynamic', '3D Depth', '4D Parallax', 'Crystal Glow', 'Particle Field', 'Neon Pulse'].map(tag => (
            <span key={tag} className="text-[10px] bg-purple-900/40 border border-purple-700/30 text-purple-300 rounded-full px-2 py-0.5">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
