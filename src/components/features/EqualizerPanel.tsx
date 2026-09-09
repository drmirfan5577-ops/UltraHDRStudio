import React, { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const EQ_BANDS = [
  { freq: '32Hz', key: 'sub' },
  { freq: '64Hz', key: 'bass' },
  { freq: '125Hz', key: 'low' },
  { freq: '250Hz', key: 'low_mid' },
  { freq: '500Hz', key: 'mid' },
  { freq: '1kHz', key: 'high_mid' },
  { freq: '2kHz', key: 'presence' },
  { freq: '4kHz', key: 'upper' },
  { freq: '8kHz', key: 'air' },
  { freq: '16kHz', key: 'high' },
];

const EQ_PRESETS = [
  { name: 'Flat', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Rock', values: [4, 3, 2, -1, -1, 1, 3, 4, 3, 2] },
  { name: 'Pop', values: [-2, 0, 2, 3, 3, 2, 0, -1, -1, -2] },
  { name: 'Jazz', values: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3] },
  { name: 'Bass Boost', values: [7, 6, 5, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Vocal', values: [-2, -1, 0, 1, 3, 4, 3, 2, 1, 0] },
];

const EqualizerPanel: React.FC<Props> = ({ onClose }) => {
  const [bands, setBands] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState('Flat');
  const { state, simulateProcess } = useAudioEngine();

  const applyPreset = (preset: typeof EQ_PRESETS[0]) => {
    setBands([...preset.values]);
    setActivePreset(preset.name);
  };

  const updateBand = (i: number, val: number) => {
    setBands(prev => { const next = [...prev]; next[i] = val; return next; });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-cyan-300 glow-text-cyan">📊 10-Band Equalizer</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Presets */}
      <div>
        <p className="text-yellow-300 text-xs font-bold mb-2">⚡ EQ Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {EQ_PRESETS.map(p => (
            <button key={p.name}
              onClick={() => applyPreset(p)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${activePreset === p.name ? 'bg-cyan-700/40 border-cyan-500 text-cyan-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* EQ Bands */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-purple-300 text-xs font-bold mb-3">🎚️ Frequency Bands</p>
        <div className="flex items-end justify-between gap-1" style={{ height: 120 }}>
          {EQ_BANDS.map((band, i) => (
            <div key={band.key} className="flex flex-col items-center gap-1 flex-1">
              <div className="relative flex-1 w-full flex flex-col items-center justify-center" style={{ height: 100 }}>
                <input
                  type="range"
                  min={-12}
                  max={12}
                  value={bands[i]}
                  onChange={e => updateBand(i, Number(e.target.value))}
                  className="absolute"
                  style={{
                    writingMode: 'vertical-lr' as const,
                    appearance: 'slider-vertical',
                    height: 90,
                    width: 6,
                    accentColor: bands[i] > 0 ? '#8b5cf6' : bands[i] < 0 ? '#06b6d4' : '#6b7280',
                  }}
                />
              </div>
              <div className={`text-[8px] text-center ${bands[i] > 0 ? 'text-purple-400' : bands[i] < 0 ? 'text-cyan-400' : 'text-white/30'}`}>
                {bands[i] > 0 ? '+' : ''}{bands[i]}
              </div>
              <div className="text-[8px] text-white/30 text-center">{band.freq}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Spectrum Display */}
      <div className="bg-black/50 rounded-xl p-3 border border-cyan-900/30">
        <p className="text-white/30 text-[10px] mb-2">Live Spectrum Analyzer</p>
        <div className="flex items-end gap-0.5 h-12">
          {Array.from({ length: 32 }).map((_, i) => {
            const h = Math.random() * 80 + 10;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  background: `hsl(${200 + i * 5}, 80%, 60%)`,
                  opacity: 0.7,
                  animation: `waveAnim ${0.8 + Math.random() * 0.8}s ease-in-out infinite`,
                  animationDelay: `${i * 0.03}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {state.processingState === 'idle' && (
        <button onClick={() => simulateProcess('Applying EQ Settings...')}
          className="btn-primary w-full text-white py-2.5 rounded-xl font-bold text-sm">
          🎚️ Apply EQ
        </button>
      )}
      {state.processingState === 'processing' && (
        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      )}
      {state.processingState === 'done' && (
        <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-center">
          <span className="text-green-400 font-bold text-sm">✅ EQ Applied!</span>
        </div>
      )}
    </div>
  );
};

export default EqualizerPanel;
