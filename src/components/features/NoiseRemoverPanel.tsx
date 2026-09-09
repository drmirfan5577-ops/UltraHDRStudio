import React, { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const NoiseRemoverPanel: React.FC<Props> = ({ onClose }) => {
  const { state, update, simulateProcess } = useAudioEngine();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-blue-300 glow-text-cyan">🔇 AI DeNoise Studio</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        {(['auto', 'manual'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === m ? 'bg-blue-700/60 border border-blue-500 text-blue-300' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
            {m === 'auto' ? '🤖 Auto AI' : '🎚️ Manual'}
          </button>
        ))}
      </div>

      {/* Features List */}
      <div className="space-y-2">
        {[
          { label: 'Background Noise Removal', desc: 'Removes ambient hiss, room noise', icon: '🔇', active: true },
          { label: 'D-Noise Filter', desc: 'Digital artifact elimination', icon: '🧹', active: true },
          { label: 'Wind Noise Filter', desc: 'Outdoor recording cleanup', icon: '💨', active: false },
          { label: 'Hum Remover (50/60Hz)', desc: 'Electrical interference removal', icon: '⚡', active: true },
          { label: 'Click & Pop Removal', desc: 'Vinyl and recording artifacts', icon: '✨', active: false },
        ].map(feat => (
          <div key={feat.label} className={`glass-card rounded-xl p-3 flex items-center gap-3 border ${feat.active ? 'border-blue-500/30' : 'border-white/5'}`}>
            <span className="text-xl">{feat.icon}</span>
            <div className="flex-1">
              <div className="text-xs font-semibold text-white">{feat.label}</div>
              <div className="text-[10px] text-white/40">{feat.desc}</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${feat.active ? 'bg-blue-400' : 'bg-white/20'}`} />
          </div>
        ))}
      </div>

      {/* Manual Controls */}
      {mode === 'manual' && (
        <div className="glass-card rounded-xl p-3 space-y-3">
          <p className="text-cyan-300 text-xs font-bold">Noise Reduction Intensity</p>
          <div>
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>Reduction Level</span>
              <span className="text-blue-300">{state.noiseReduction}%</span>
            </div>
            <input type="range" min={0} max={100} value={state.noiseReduction}
              onChange={e => update({ noiseReduction: Number(e.target.value) })}
              className="w-full" style={{ accentColor: '#06b6d4' }} />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>Frequency Threshold</span>
              <span className="text-blue-300">Auto</span>
            </div>
            <input type="range" min={0} max={100} defaultValue={55}
              className="w-full" style={{ accentColor: '#3b82f6' }} />
          </div>
        </div>
      )}

      {/* Vocal Purifier */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-pink-300 text-xs font-bold">🎤 Vocals Purifier / Booster</p>
        <div>
          <div className="flex justify-between text-[10px] text-white/60 mb-1">
            <span>Vocal Clarity Boost</span>
            <span className="text-pink-300">{state.vocalBoost}%</span>
          </div>
          <input type="range" min={0} max={100} value={state.vocalBoost}
            onChange={e => update({ vocalBoost: Number(e.target.value) })}
            className="w-full" style={{ accentColor: '#ec4899' }} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => update({ vocalsOnly: !state.vocalsOnly })}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${state.vocalsOnly ? 'bg-pink-700/50 border-pink-500 text-pink-300' : 'border-white/15 text-white/40'}`}
          >
            🎤 Just Vocals
          </button>
          <button
            onClick={() => update({ bgOnly: !state.bgOnly })}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${state.bgOnly ? 'bg-cyan-700/50 border-cyan-500 text-cyan-300' : 'border-white/15 text-white/40'}`}
          >
            🎵 Just Background
          </button>
        </div>
      </div>

      {/* Process */}
      {state.processingState === 'idle' && (
        <button onClick={() => simulateProcess('AI DeNoise Processing...')}
          className="w-full py-2.5 rounded-xl font-bold text-sm text-white btn-secondary">
          🔬 Run AI DeNoise
        </button>
      )}
      {state.processingState === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>🔄 {state.processingLabel}</span>
            <span className="text-blue-300">{state.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      )}
      {state.processingState === 'done' && (
        <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-center">
          <span className="text-green-400 font-bold text-sm">✅ DeNoise Complete!</span>
        </div>
      )}
    </div>
  );
};

export default NoiseRemoverPanel;
