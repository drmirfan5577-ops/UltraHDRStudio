import React, { useState } from 'react';
import { VOICE_PRESETS } from '@/constants/features';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const VoiceChangerPanel: React.FC<Props> = ({ onClose }) => {
  const { state, update, simulateProcess } = useAudioEngine();
  const [activePreset, setActivePreset] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-indigo-300">🎭 Voice FX Studio</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Presets */}
      <div>
        <p className="text-cyan-300 text-xs font-semibold mb-2">🎭 Voice Presets</p>
        <div className="grid grid-cols-4 gap-2">
          {VOICE_PRESETS.map(p => (
            <button key={p.id}
              onClick={() => setActivePreset(activePreset === p.id ? null : p.id)}
              className={`rounded-xl p-2 text-center transition-all border ${activePreset === p.id ? 'bg-indigo-700/50 border-indigo-500 text-indigo-300 scale-105' : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70'}`}>
              <div className="text-2xl">{p.icon}</div>
              <div className="text-[9px] mt-0.5">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fine Controls */}
      <div className="glass-card rounded-xl p-3 space-y-3">
        <p className="text-yellow-300 text-xs font-bold">🎚️ Voice Shaping</p>
        {[
          { label: 'Pitch Shift', min: -24, max: 24, def: 0, color: '#8b5cf6' },
          { label: 'Formant', min: -10, max: 10, def: 0, color: '#06b6d4' },
          { label: 'Breathiness', min: 0, max: 100, def: 20, color: '#ec4899' },
          { label: 'Clarity', min: 0, max: 100, def: 75, color: '#10b981' },
        ].map(ctrl => {
          const [val, setVal] = React.useState(ctrl.def);
          return (
            <div key={ctrl.label}>
              <div className="flex justify-between text-[10px] text-white/60 mb-1">
                <span>{ctrl.label}</span>
                <span style={{ color: ctrl.color }}>{val}</span>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} value={val}
                onChange={e => setVal(Number(e.target.value))}
                className="w-full" style={{ accentColor: ctrl.color }} />
            </div>
          );
        })}
      </div>

      {/* Enhancement Features */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-green-400 text-xs font-bold">✨ Voice Enhancement</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Voice Buffering', icon: '🔄', color: 'cyan' },
            { label: 'Loud Sound Boost', icon: '📢', color: 'orange' },
            { label: 'Echo Effect', icon: '🔁', color: 'purple' },
            { label: 'Reverb Hall', icon: '🌊', color: 'blue' },
          ].map(feat => (
            <button key={feat.label}
              className="btn-secondary rounded-xl p-2 text-xs text-white/80 text-center hover:text-white">
              <div className="text-lg">{feat.icon}</div>
              <div className="text-[10px] mt-0.5">{feat.label}</div>
            </button>
          ))}
        </div>
      </div>

      {state.processingState === 'idle' && (
        <button onClick={() => simulateProcess('Processing Voice Effects...')}
          className="btn-primary w-full text-white py-2.5 rounded-xl font-bold text-sm">
          ⚡ Apply Voice FX
        </button>
      )}
      {state.processingState === 'processing' && (
        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${state.progress}%` }} />
          </div>
          <p className="text-center text-xs text-indigo-300">{state.progress}% — {state.processingLabel}</p>
        </div>
      )}
      {state.processingState === 'done' && (
        <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-center">
          <span className="text-green-400 font-bold text-sm">✅ Voice FX Applied!</span>
        </div>
      )}
    </div>
  );
};

export default VoiceChangerPanel;
