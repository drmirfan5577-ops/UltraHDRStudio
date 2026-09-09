import React, { useState, useRef, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

interface Stem {
  id: string;
  label: string;
  icon: string;
  color: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  separated: boolean;
}

type SeparateState = 'idle' | 'uploading' | 'analyzing' | 'separating' | 'done';

const DEFAULT_STEMS: Stem[] = [
  { id: 'vocals', label: 'Vocals / Lead', icon: '🎤', color: '#ec4899', volume: 100, muted: false, solo: false, separated: false },
  { id: 'bgm', label: 'Background Music', icon: '🎵', color: '#8b5cf6', volume: 100, muted: false, solo: false, separated: false },
  { id: 'bass', label: 'Bass Guitar', icon: '🎸', color: '#f59e0b', volume: 100, muted: false, solo: false, separated: false },
  { id: 'drums', label: 'Drums / Percussion', icon: '🥁', color: '#ef4444', volume: 100, muted: false, solo: false, separated: false },
  { id: 'piano', label: 'Piano / Keys', icon: '🎹', color: '#06b6d4', volume: 100, muted: false, solo: false, separated: false },
  { id: 'guitar', label: 'Lead Guitar', icon: '🎸', color: '#10b981', volume: 100, muted: false, solo: false, separated: false },
  { id: 'violin', label: 'Violin / Strings', icon: '🎻', color: '#a855f7', volume: 100, muted: false, solo: false, separated: false },
  { id: 'instrumental', label: 'Full Instrumental', icon: '🎼', color: '#14b8a6', volume: 100, muted: false, solo: false, separated: false },
];

const AI_MODELS = [
  { id: 'ultra', label: 'Ultra HDR AI™', desc: '8-stem separation — highest quality', badge: 'PREMIUM' },
  { id: 'fast', label: 'FastSep™', desc: '4-stem separation — quick processing', badge: 'FAST' },
  { id: 'vocal', label: 'VocalX™', desc: 'Vocals + instrumental only', badge: 'FOCUSED' },
];

const PROMPTS = [
  'Separate lead vocals to create clean a cappella track',
  'Extract pure instrumental BGM for karaoke backing',
  'Isolate bass guitar for remixing and resampling',
  'Split all 8 stems for full music production rearrangement',
  'Extract piano melody for classical arrangement transcription',
  'Separate violin strings for orchestral recomposition',
  'Remove vocals completely — pure instrumental export',
  'Extract drums and percussion for beat resampling',
  'Create acapella version for vocal layering practice',
  'Isolate BGM for multi-track remix production session',
];

const STEP_LABELS: Record<SeparateState, string> = {
  idle: '',
  uploading: '📤 Uploading & analyzing waveform...',
  analyzing: '🧠 AI neural network processing...',
  separating: '⚡ Separating audio stems...',
  done: '✅ All stems extracted successfully!',
};

const ScreenRecorder_separator: React.FC<Props> = ({ onClose }) => {
  const [stems, setStems] = useState<Stem[]>(DEFAULT_STEMS);
  const [fileName, setFileName] = useState<string | null>(null);
  const [separateState, setSeparateState] = useState<SeparateState>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState('ultra');
  const [showPrompts, setShowPrompts] = useState(false);
  const [activePrompt, setActivePrompt] = useState('');
  const [meters, setMeters] = useState<Record<string, number>>({});
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [selectedStems, setSelectedStems] = useState<string[]>(DEFAULT_STEMS.map(s => s.id));
  const meterInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPreviewPlaying && separateState === 'done') {
      meterInterval.current = setInterval(() => {
        setMeters(prev => {
          const updated: Record<string, number> = {};
          stems.forEach(s => {
            if (!s.muted && s.separated) {
              const soloed = stems.some(x => x.solo);
              if (!soloed || s.solo) {
                updated[s.id] = Math.random() * 50 + (s.volume * 0.5);
              }
            }
          });
          return updated;
        });
      }, 80);
    } else {
      if (meterInterval.current) clearInterval(meterInterval.current);
      setMeters({});
    }
    return () => { if (meterInterval.current) clearInterval(meterInterval.current); };
  }, [isPreviewPlaying, separateState, stems]);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setFileName(file.name);
    };
    input.click();
  };

  const startSeparation = () => {
    const steps: SeparateState[] = ['uploading', 'analyzing', 'separating', 'done'];
    let step = 0;
    let prog = 0;
    setSeparateState('uploading');
    setProgress(0);
    const iv = setInterval(() => {
      prog += Math.random() * 8 + 3;
      setProgress(Math.min(100, Math.round(prog)));
      if (prog >= (step + 1) * 33) {
        step++;
        if (step < steps.length) setSeparateState(steps[step]);
      }
      if (prog >= 100) {
        clearInterval(iv);
        setSeparateState('done');
        setProgress(100);
        setStems(prev => prev.map(s => ({
          ...s,
          separated: selectedStems.includes(s.id),
        })));
      }
    }, 250);
  };

  const updateStem = (id: string, patch: Partial<Stem>) => {
    setStems(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const toggleStemSelect = (id: string) => {
    setSelectedStems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const soloed = stems.some(s => s.solo);
  const readyStemCount = stems.filter(s => s.separated).length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-pink-300" style={{ textShadow: '0 0 20px rgba(236,72,153,0.6)' }}>
          🎧 AI Vocal Separator
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Prompts */}
      <div className="glass-card rounded-xl p-2.5">
        <button onClick={() => setShowPrompts(!showPrompts)} className="w-full flex items-center justify-between text-[10px] text-yellow-300 font-bold">
          <span>💡 Ready-Made Prompts ({PROMPTS.length})</span>
          <span>{showPrompts ? '▲' : '▼'}</span>
        </button>
        {showPrompts && (
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {PROMPTS.map((p, i) => (
              <button key={i} onClick={() => { setActivePrompt(p); setShowPrompts(false); }}
                className={`w-full text-left text-[9px] p-1.5 rounded-lg transition-all ${activePrompt === p ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/40' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
        {activePrompt && (
          <div className="mt-2 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-2">
            <p className="text-yellow-400 text-[9px]">🎯 {activePrompt}</p>
          </div>
        )}
      </div>

      {/* AI Model */}
      <div>
        <p className="text-white/40 text-[10px] font-bold mb-2">🤖 AI Separation Model</p>
        <div className="space-y-1.5">
          {AI_MODELS.map(m => (
            <button key={m.id} onClick={() => setSelectedModel(m.id)}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl border transition-all ${selectedModel === m.id ? 'bg-pink-900/30 border-pink-500/60' : 'border-white/8 hover:border-white/20'}`}>
              <div className="flex-1 text-left">
                <p className={`text-[11px] font-bold ${selectedModel === m.id ? 'text-pink-300' : 'text-white/70'}`}>{m.label}</p>
                <p className="text-[9px] text-white/40">{m.desc}</p>
              </div>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${selectedModel === m.id ? 'bg-pink-900/50 text-pink-300 border border-pink-700/50' : 'bg-white/5 text-white/30 border border-white/10'}`}>{m.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <p className="text-white/40 text-[10px] font-bold mb-2">📁 Source Audio/Video File</p>
        <button onClick={handleFileSelect}
          className="w-full border-2 border-dashed border-pink-700/40 rounded-xl p-4 text-center hover:border-pink-500/60 transition-all group"
          style={{ background: fileName ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.02)' }}>
          {fileName ? (
            <div className="space-y-1">
              <p className="text-2xl">🎵</p>
              <p className="text-pink-300 text-xs font-bold truncate">{fileName}</p>
              <p className="text-white/30 text-[9px]">Tap to change file</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-3xl opacity-50">🎵</p>
              <p className="text-white/50 text-xs font-bold">Drop audio/video file here</p>
              <p className="text-white/25 text-[9px]">MP3, WAV, FLAC, MP4, AAC supported</p>
            </div>
          )}
        </button>
      </div>

      {/* Stem Selection */}
      <div>
        <p className="text-white/40 text-[10px] font-bold mb-2">🎼 Select Stems to Extract</p>
        <div className="grid grid-cols-2 gap-1.5">
          {DEFAULT_STEMS.map(s => (
            <button key={s.id} onClick={() => toggleStemSelect(s.id)}
              className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${selectedStems.includes(s.id) ? 'border-opacity-80' : 'border-white/8 opacity-50'}`}
              style={{ borderColor: selectedStems.includes(s.id) ? `${s.color}80` : undefined, background: selectedStems.includes(s.id) ? `${s.color}15` : 'rgba(255,255,255,0.02)' }}>
              <span>{s.icon}</span>
              <span className="text-[9px] font-bold" style={{ color: selectedStems.includes(s.id) ? s.color : 'rgba(255,255,255,0.4)' }}>{s.label.split(' / ')[0]}</span>
              {selectedStems.includes(s.id) && <span className="ml-auto text-[8px]" style={{ color: s.color }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Processing */}
      {separateState !== 'idle' && (
        <div className="glass-card rounded-xl p-4 space-y-3">
          <p className="text-pink-300 text-xs font-bold">🧠 AI Processing</p>
          <div className="space-y-1.5">
            {(['uploading', 'analyzing', 'separating'] as SeparateState[]).map((step, i) => {
              const order: SeparateState[] = ['uploading', 'analyzing', 'separating', 'done'];
              const cur = order.indexOf(separateState);
              const me = order.indexOf(step);
              const done = cur > me || separateState === 'done';
              const active = cur === me;
              return (
                <div key={step} className={`flex items-center gap-2 p-1.5 rounded-lg ${active ? 'bg-pink-900/20' : ''}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${done ? 'bg-green-600' : active ? 'bg-pink-600 animate-pulse' : 'bg-white/10'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] ${active ? 'text-pink-300 font-bold' : done ? 'text-white/50' : 'text-white/25'}`}>
                    {STEP_LABELS[step].replace('📤 ', '').replace('🧠 ', '').replace('⚡ ', '')}
                  </span>
                </div>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between text-[9px] text-white/40 mb-1">
              <span>{STEP_LABELS[separateState]}</span>
              <span className="text-pink-400 font-bold">{progress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: separateState === 'done' ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#9d174d,#ec4899)',
                  boxShadow: separateState === 'done' ? '0 0 10px rgba(34,197,94,0.5)' : '0 0 10px rgba(236,72,153,0.5)',
                }} />
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      {separateState === 'idle' && (
        <button onClick={startSeparation}
          disabled={!fileName && selectedStems.length === 0}
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, #9d174d, #ec4899)',
            border: '1px solid rgba(236,72,153,0.6)',
            boxShadow: '0 0 25px rgba(236,72,153,0.4)',
          }}>
          🎧 Separate {selectedStems.length} Stems with AI
        </button>
      )}

      {/* Stem Controls (post-separation) */}
      {separateState === 'done' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-green-400 text-xs font-bold">✅ {readyStemCount} Stems Ready</p>
            <button onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
              className="text-[10px] btn-primary text-white px-3 py-1.5 rounded-lg font-bold">
              {isPreviewPlaying ? '⏸ Stop' : '▶ Preview All'}
            </button>
          </div>
          <div className="space-y-2">
            {stems.filter(s => s.separated).map(stem => {
              const meter = meters[stem.id] || 0;
              const isActive = !stem.muted && (!soloed || stem.solo);
              return (
                <div key={stem.id} className="glass-card rounded-xl p-2.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg w-7 text-center">{stem.icon}</span>
                    <p className="flex-1 text-[11px] font-bold" style={{ color: stem.color }}>{stem.label}</p>
                    <div className="flex gap-1">
                      <button onClick={() => updateStem(stem.id, { muted: !stem.muted })}
                        className={`w-6 h-6 rounded text-[8px] font-bold border ${stem.muted ? 'bg-orange-700/50 border-orange-500 text-orange-300' : 'border-white/15 text-white/40'}`}>M</button>
                      <button onClick={() => updateStem(stem.id, { solo: !stem.solo })}
                        className={`w-6 h-6 rounded text-[8px] font-bold border ${stem.solo ? 'bg-yellow-700/50 border-yellow-500 text-yellow-300' : 'border-white/15 text-white/40'}`}>S</button>
                      <button className="w-6 h-6 rounded text-[8px] font-bold border border-white/15 text-white/40 hover:text-white hover:border-white/30">⬇</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="range" min={0} max={100} value={stem.volume}
                      onChange={e => updateStem(stem.id, { volume: +e.target.value })}
                      className="flex-1" style={{ accentColor: stem.color }} />
                    <span className="text-[9px] w-6" style={{ color: stem.color }}>{stem.volume}</span>
                    {/* Mini meter */}
                    <div className="flex gap-0.5 h-5 items-end">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-1.5 rounded-t-sm transition-all"
                          style={{
                            height: isActive && isPreviewPlaying ? `${(meter / 100) * 100}%` : '10%',
                            background: i >= 6 ? '#ef4444' : stem.color,
                            opacity: isActive ? 1 : 0.2,
                            transition: 'height 0.08s ease',
                          }} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Export All */}
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-primary text-white py-2 rounded-xl text-xs font-bold">💾 Export All Stems</button>
            <button className="btn-secondary text-white py-2 rounded-xl text-xs font-bold">🔄 Re-process</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder_separator;
