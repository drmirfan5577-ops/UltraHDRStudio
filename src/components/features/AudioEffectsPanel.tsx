import React, { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { AUDIO_EFFECTS, QUALITY_OPTIONS } from '@/constants/features';

interface Props {
  onClose: () => void;
}

const AudioEffectsPanel: React.FC<Props> = ({ onClose }) => {
  const { state, update, simulateProcess } = useAudioEngine();
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-purple-300 glow-text-purple">🎛️ Audio Effects Studio</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Genre/Style Effects */}
      <div>
        <p className="text-cyan-300 text-xs font-semibold mb-2">🎸 Genre & Style Presets</p>
        <div className="grid grid-cols-3 gap-2">
          {AUDIO_EFFECTS.map(eff => (
            <button
              key={eff.id}
              onClick={() => { setActiveEffect(activeEffect === eff.id ? null : eff.id); update({ selectedEffect: eff.id }); }}
              className={`rounded-xl p-2 text-center transition-all border ${activeEffect === eff.id ? 'border-current bg-white/10 scale-105' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              style={{ color: eff.color, borderColor: activeEffect === eff.id ? eff.color : undefined, boxShadow: activeEffect === eff.id ? `0 0 12px ${eff.color}60` : undefined }}
            >
              <div className="text-lg">{eff.icon}</div>
              <div className="text-[10px] mt-0.5 font-medium">{eff.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* EQ Controls */}
      <div className="glass-card rounded-xl p-3 space-y-3">
        <p className="text-yellow-300 text-xs font-bold">🎚️ Live Controls</p>
        {[
          { label: 'Volume', key: 'volume', min: 0, max: 100, color: '#8b5cf6' },
          { label: 'Pitch', key: 'pitch', min: -12, max: 12, color: '#06b6d4' },
          { label: 'Speed %', key: 'speed', min: 50, max: 200, color: '#f59e0b' },
        ].map(ctrl => (
          <div key={ctrl.key}>
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>{ctrl.label}</span>
              <span style={{ color: ctrl.color }}>{state[ctrl.key as keyof typeof state]}</span>
            </div>
            <input
              type="range"
              min={ctrl.min}
              max={ctrl.max}
              value={state[ctrl.key as keyof typeof state] as number}
              onChange={e => update({ [ctrl.key]: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: ctrl.color }}
            />
          </div>
        ))}
      </div>

      {/* Quality */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-green-400 text-xs font-bold mb-2">⚡ Output Quality</p>
        <div className="flex flex-wrap gap-1.5">
          {QUALITY_OPTIONS.map(q => (
            <button
              key={q.value}
              onClick={() => update({ quality: q.value })}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${state.quality === q.value ? 'bg-green-600/40 border-green-500 text-green-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Process Button */}
      {state.processingState === 'idle' && (
        <button
          onClick={() => simulateProcess('Applying Audio Effects...')}
          className="btn-primary w-full text-white py-2.5 rounded-xl font-bold text-sm"
        >
          ⚡ Apply Effects
        </button>
      )}
      {state.processingState === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>🔄 {state.processingLabel}</span>
            <span className="text-purple-300">{state.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      )}
      {state.processingState === 'done' && (
        <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-center">
          <span className="text-green-400 font-bold text-sm">✅ Effects Applied Successfully!</span>
        </div>
      )}
    </div>
  );
};

export default AudioEffectsPanel;
