import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  onClose: () => void;
}

interface Track {
  id: string;
  name: string;
  icon: string;
  color: string;
  steps: boolean[];
  volume: number;
}

const DEFAULT_TRACKS: Track[] = [
  { id: 'kick', name: 'Kick', icon: '🥁', color: '#ef4444', volume: 90, steps: [true,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false] },
  { id: 'snare', name: 'Snare', icon: '🪘', color: '#f59e0b', volume: 80, steps: [false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false] },
  { id: 'hihat', name: 'Hi-Hat', icon: '🎩', color: '#06b6d4', volume: 70, steps: [true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false] },
  { id: 'clap', name: 'Clap', icon: '👏', color: '#ec4899', volume: 75, steps: [false,false,false,false,true,false,false,true,false,false,false,false,true,false,false,false] },
  { id: 'tom', name: 'Tom', icon: '🔴', color: '#8b5cf6', volume: 65, steps: [false,false,false,true,false,false,true,false,false,false,false,true,false,false,false,false] },
  { id: 'perc', name: 'Perc', icon: '🔔', color: '#10b981', volume: 60, steps: [false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true] },
  { id: 'bass', name: 'Sub Bass', icon: '🔊', color: '#a855f7', volume: 85, steps: [true,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false] },
  { id: 'cymbal', name: 'Cymbal', icon: '✨', color: '#fbbf24', volume: 55, steps: [false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true] },
];

const PATTERNS = [
  { name: 'Hip Hop', desc: 'Classic boom-bap pattern', bpm: 90 },
  { name: 'House', desc: '4/4 dance music rhythm', bpm: 128 },
  { name: 'Trap', desc: 'Modern hi-hat triplets', bpm: 140 },
  { name: 'Rock', desc: 'Hard hitting rock beat', bpm: 120 },
  { name: 'Reggaeton', desc: 'Dembow riddim pattern', bpm: 95 },
  { name: 'Jazz', desc: 'Swinging brush pattern', bpm: 110 },
];

const PROMPTS = [
  'Create a boom-bap hip hop beat at 90 BPM with punchy kick and snare',
  'Build a house music beat with 4/4 kick pattern and rolling hi-hats',
  'Make a trap beat with sliding 808 bass and rapid hi-hat triplets',
  'Compose a reggaeton beat with the classic dembow riddim',
  'Design a jazz-inspired beat with swinging brushed snare pattern',
  'Create a hard rock drum beat with double kick and crashing cymbals',
  'Build an Afrobeats pattern with syncopated percussions and bass',
  'Make a lo-fi hip hop beat with dusty kick and off-grid snare',
];

const BeatMaker: React.FC<Props> = ({ onClose }) => {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [swing, setSwing] = useState(0);
  const [masterVol, setMasterVol] = useState(85);
  const [steps, setSteps] = useState(16);
  const [showPrompts, setShowPrompts] = useState(false);
  const [activePrompt, setActivePrompt] = useState('');
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const [savedPatterns, setSavedPatterns] = useState<{ name: string; tracks: Track[]; bpm: number }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClick = useCallback((trackId: string, vol: number) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const freqMap: Record<string, number> = { kick: 60, snare: 200, hihat: 8000, clap: 1200, tom: 120, perc: 400, bass: 50, cymbal: 6000 };
      osc.frequency.value = freqMap[trackId] || 220;
      osc.type = trackId === 'hihat' || trackId === 'cymbal' ? 'sawtooth' : trackId === 'kick' || trackId === 'bass' ? 'sine' : 'square';
      gain.gain.setValueAtTime((vol / 100) * (masterVol / 100) * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (trackId === 'kick' ? 0.3 : trackId === 'hihat' ? 0.05 : 0.15));
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* audio context may not be available */ }
  }, [masterVol]);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentStep(-1);
      return;
    }
    let step = 0;
    const ms = (60 / bpm / 4) * 1000;
    intervalRef.current = setInterval(() => {
      const swingOffset = swing > 0 && step % 2 === 1 ? (swing / 100) * ms * 0.33 : 0;
      setTimeout(() => {
        setCurrentStep(step % steps);
        tracks.forEach(track => {
          if (track.steps[step % steps]) {
            playClick(track.id, track.volume);
          }
        });
        step++;
      }, swingOffset);
    }, ms);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, bpm, tracks, steps, swing, playClick]);

  const toggleStep = (trackId: string, stepIdx: number) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, steps: t.steps.map((s, i) => i === stepIdx ? !s : s) } : t
    ));
  };

  const clearTrack = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, steps: Array(16).fill(false) } : t));
  };

  const randomizeTrack = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? {
      ...t, steps: Array(16).fill(false).map(() => Math.random() > 0.7)
    } : t));
  };

  const loadPattern = (pattern: typeof PATTERNS[0]) => {
    setActivePattern(pattern.name);
    setBpm(pattern.bpm);
    // Shuffle steps based on pattern type
    const seed = pattern.name.length;
    setTracks(prev => prev.map((t, i) => ({
      ...t,
      steps: Array(16).fill(false).map((_, j) => {
        const magic = (i * 7 + j * seed + pattern.bpm) % 4;
        return magic === 0 || (t.id === 'kick' && (j === 0 || j === 8)) || (t.id === 'snare' && (j === 4 || j === 12));
      }),
    })));
  };

  const savePattern = () => {
    const name = `Pattern ${savedPatterns.length + 1}`;
    setSavedPatterns(prev => [...prev, { name, tracks: JSON.parse(JSON.stringify(tracks)), bpm }]);
  };

  const updateTrackVol = (id: string, vol: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, volume: vol } : t));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-yellow-300" style={{ textShadow: '0 0 20px rgba(245,158,11,0.6)' }}>
          🥁 Beat / Rhythm Maker
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
          <div className="mt-2 space-y-1 max-h-28 overflow-y-auto">
            {PROMPTS.map((p, i) => (
              <button key={i} onClick={() => { setActivePrompt(p); setShowPrompts(false); }}
                className={`w-full text-left text-[9px] p-1.5 rounded-lg transition-all ${activePrompt === p ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/40' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transport */}
      <div className="glass-panel-bright rounded-xl p-3 space-y-3"
        style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Play/Stop */}
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white font-bold"
            style={{
              background: isPlaying ? 'linear-gradient(135deg,#b45309,#d97706)' : 'linear-gradient(135deg,#16a34a,#15803d)',
              boxShadow: isPlaying ? '0 0 20px rgba(245,158,11,0.6)' : '0 0 20px rgba(34,197,94,0.5)',
            }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={() => { setIsPlaying(false); setCurrentStep(-1); }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 text-sm">⏹</button>

          {/* Beat indicators */}
          <div className="flex gap-1">
            {[0,1,2,3].map(b => (
              <div key={b} className="w-4 h-4 rounded-sm transition-all"
                style={{
                  background: isPlaying && Math.floor(currentStep / 4) === b ? (b === 0 ? '#ef4444' : '#f59e0b') : 'rgba(255,255,255,0.08)',
                  boxShadow: isPlaying && Math.floor(currentStep / 4) === b ? '0 0 8px rgba(245,158,11,0.8)' : 'none',
                }} />
            ))}
          </div>

          {/* BPM */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setBpm(b => Math.max(40, b - 5))} className="w-6 h-6 rounded bg-white/10 text-white/60 text-xs hover:bg-white/20">−</button>
            <div className="text-center">
              <div className="text-yellow-400 font-bold font-mono text-sm">{bpm}</div>
              <div className="text-[8px] text-white/30">BPM</div>
            </div>
            <button onClick={() => setBpm(b => Math.min(240, b + 5))} className="w-6 h-6 rounded bg-white/10 text-white/60 text-xs hover:bg-white/20">+</button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/30 text-[9px]">Steps:</span>
            {[8, 16, 32].map(s => (
              <button key={s} onClick={() => setSteps(s)}
                className={`w-7 h-6 rounded text-[9px] font-bold border transition-all ${steps === s ? 'bg-yellow-700/40 border-yellow-500 text-yellow-300' : 'border-white/10 text-white/30 hover:border-white/25'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Swing + Master Vol */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-[9px] text-white/40 mb-0.5">
              <span>Swing</span><span className="text-yellow-400">{swing}%</span>
            </div>
            <input type="range" min={0} max={66} value={swing} onChange={e => setSwing(+e.target.value)}
              className="w-full" style={{ accentColor: '#f59e0b' }} />
          </div>
          <div>
            <div className="flex justify-between text-[9px] text-white/40 mb-0.5">
              <span>Master Vol</span><span className="text-green-400">{masterVol}%</span>
            </div>
            <input type="range" min={0} max={100} value={masterVol} onChange={e => setMasterVol(+e.target.value)}
              className="w-full" style={{ accentColor: '#22c55e' }} />
          </div>
        </div>
      </div>

      {/* Pattern Presets */}
      <div>
        <p className="text-white/40 text-[10px] font-bold mb-2">🎵 Pattern Presets</p>
        <div className="grid grid-cols-3 gap-1.5">
          {PATTERNS.map(p => (
            <button key={p.name} onClick={() => loadPattern(p)}
              className={`p-2 rounded-xl border text-center transition-all ${activePattern === p.name ? 'bg-yellow-900/30 border-yellow-500/60 text-yellow-300' : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white/80'}`}>
              <p className="text-[10px] font-bold">{p.name}</p>
              <p className="text-[8px] opacity-60">{p.bpm} BPM</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step Sequencer Grid */}
      <div>
        <p className="text-white/40 text-[10px] font-bold mb-2">🎚️ Step Sequencer — {steps} Steps</p>
        <div className="space-y-1.5 overflow-x-auto">
          {tracks.map(track => (
            <div key={track.id} className="flex items-center gap-1.5 min-w-0">
              {/* Track label */}
              <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
                <span className="text-sm">{track.icon}</span>
                <span className="text-[9px] font-bold truncate" style={{ color: track.color }}>{track.name}</span>
              </div>
              {/* Steps */}
              <div className="flex gap-0.5 flex-1 overflow-x-auto">
                {Array.from({ length: steps }).map((_, i) => {
                  const isActive = track.steps[i] || false;
                  const isCurrent = isPlaying && currentStep === i;
                  const isBeat = i % 4 === 0;
                  return (
                    <button
                      key={i}
                      onClick={() => toggleStep(track.id, i)}
                      className="rounded-sm transition-all flex-shrink-0"
                      style={{
                        width: steps === 32 ? 14 : steps === 8 ? 24 : 18,
                        height: 24,
                        background: isActive
                          ? isCurrent ? `${track.color}` : `${track.color}cc`
                          : isCurrent ? 'rgba(255,255,255,0.25)' : isBeat ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                        border: isActive ? `1px solid ${track.color}` : isBeat ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.04)',
                        boxShadow: isActive ? `0 0 6px ${track.color}80` : isCurrent ? '0 0 4px rgba(255,255,255,0.3)' : 'none',
                        transform: isCurrent && isActive ? 'scaleY(1.1)' : 'none',
                      }}
                    />
                  );
                })}
              </div>
              {/* Quick controls */}
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => randomizeTrack(track.id)} className="w-5 h-5 rounded text-[8px] text-white/30 hover:text-white/70 bg-white/5 hover:bg-white/10">🎲</button>
                <button onClick={() => clearTrack(track.id)} className="w-5 h-5 rounded text-[8px] text-white/30 hover:text-red-400 bg-white/5 hover:bg-white/10">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volume Faders */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-white/40 text-[10px] font-bold mb-2">🔊 Track Volumes</p>
        <div className="grid grid-cols-4 gap-x-3 gap-y-1.5">
          {tracks.map(track => (
            <div key={track.id}>
              <div className="flex justify-between text-[8px] mb-0.5">
                <span style={{ color: track.color }}>{track.name.slice(0,4)}</span>
                <span className="text-white/30">{track.volume}</span>
              </div>
              <input type="range" min={0} max={100} value={track.volume}
                onChange={e => updateTrackVol(track.id, +e.target.value)}
                className="w-full" style={{ accentColor: track.color }} />
            </div>
          ))}
        </div>
      </div>

      {/* Save/Export */}
      <div className="flex gap-2">
        <button onClick={savePattern} className="flex-1 btn-secondary text-white py-2 rounded-xl text-xs font-bold">
          💾 Save Pattern
        </button>
        <button className="flex-1 btn-primary text-white py-2 rounded-xl text-xs font-bold">
          📤 Export WAV
        </button>
      </div>
      {savedPatterns.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-green-400 text-[10px] font-bold">📂 Saved Patterns ({savedPatterns.length})</p>
          {savedPatterns.map((p, i) => (
            <button key={i} onClick={() => { setTracks(p.tracks); setBpm(p.bpm); }}
              className="w-full glass-card rounded-xl p-2 flex items-center gap-2 hover:bg-white/8 transition-all">
              <span className="text-base">🎵</span>
              <span className="text-[10px] text-white/70">{p.name}</span>
              <span className="text-[9px] text-white/30 ml-auto">{p.bpm} BPM</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeatMaker;
