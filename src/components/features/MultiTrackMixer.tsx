import React, { useState, useRef, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

interface Track {
  id: string;
  name: string;
  icon: string;
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  fx: boolean;
  gain: number;
}

const DEFAULT_TRACKS: Track[] = [
  { id: 't1', name: 'Vocals', icon: '🎤', color: '#ec4899', volume: 85, pan: 0, muted: false, solo: false, fx: true, gain: 0 },
  { id: 't2', name: 'Bass', icon: '🎸', color: '#f59e0b', volume: 75, pan: -10, muted: false, solo: false, fx: false, gain: 2 },
  { id: 't3', name: 'Drums', icon: '🥁', color: '#ef4444', volume: 80, pan: 0, muted: false, solo: false, fx: false, gain: 0 },
  { id: 't4', name: 'Guitar', icon: '🎵', color: '#8b5cf6', volume: 70, pan: 20, muted: false, solo: false, fx: true, gain: -2 },
  { id: 't5', name: 'Keys', icon: '🎹', color: '#06b6d4', volume: 65, pan: -20, muted: true, solo: false, fx: false, gain: 0 },
  { id: 't6', name: 'FX / Synth', icon: '🔮', color: '#10b981', volume: 55, pan: 5, muted: false, solo: false, fx: true, gain: 1 },
];

let trackCounter = DEFAULT_TRACKS.length;

const MultiTrackMixer: React.FC<Props> = ({ onClose }) => {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [masterVolume, setMasterVolume] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [meters, setMeters] = useState<Record<string, number>>({});

  // Simulate VU meters
  useEffect(() => {
    if (!isPlaying) {
      setMeters({});
      return;
    }
    const iv = setInterval(() => {
      setMeters(prev => {
        const updated: Record<string, number> = {};
        tracks.forEach(t => {
          if (!t.muted) {
            const soloed = tracks.some(x => x.solo);
            if (!soloed || t.solo) {
              updated[t.id] = Math.random() * 40 + (t.volume * 0.6);
            }
          }
        });
        return updated;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [isPlaying, tracks]);

  useEffect(() => {
    if (isPlaying) {
      beatRef.current = setInterval(() => {
        setBeat(b => (b + 1) % 4);
      }, (60 / bpm) * 1000);
    } else {
      if (beatRef.current) clearInterval(beatRef.current);
      setBeat(0);
    }
    return () => { if (beatRef.current) clearInterval(beatRef.current); };
  }, [isPlaying, bpm]);

  const updateTrack = (id: string, patch: Partial<Track>) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const addTrack = () => {
    trackCounter++;
    setTracks(prev => [...prev, {
      id: `t${trackCounter}`, name: `Track ${trackCounter}`, icon: '🎵',
      color: '#a855f7', volume: 70, pan: 0, muted: false, solo: false, fx: false, gain: 0,
    }]);
  };

  const deleteTrack = (id: string) => setTracks(prev => prev.filter(t => t.id !== id));

  const masterMeter = Object.values(meters).reduce((a, b) => Math.max(a, b), 0);
  const soloed = tracks.some(t => t.solo);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-purple-300 glow-text-purple">🎛️ Multi-Track Mixer</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Transport + BPM */}
      <div className="glass-panel-bright rounded-xl p-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg text-white"
            style={{ background: isPlaying ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'rgba(255,255,255,0.1)', boxShadow: isPlaying ? '0 0 20px rgba(139,92,246,0.6)' : 'none' }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={() => { setIsPlaying(false); setBeat(0); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm text-white/60">⏹</button>
          <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm text-white/60">⏺</button>
        </div>

        {/* Beat indicator */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(b => (
            <div key={b} className="w-4 h-4 rounded-sm transition-all"
              style={{
                background: isPlaying && beat === b ? (b === 0 ? '#ef4444' : '#8b5cf6') : 'rgba(255,255,255,0.1)',
                boxShadow: isPlaying && beat === b ? `0 0 8px ${b === 0 ? '#ef4444' : '#8b5cf6'}` : 'none',
              }} />
          ))}
        </div>

        {/* BPM */}
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-[10px]">BPM</span>
          <input type="number" value={bpm} onChange={e => setBpm(Number(e.target.value))}
            className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center outline-none focus:border-purple-500/50"
            min={40} max={240} />
        </div>

        {/* Master Volume */}
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-white/40 text-[9px]">MASTER</span>
          <input type="range" min={0} max={100} value={masterVolume}
            onChange={e => setMasterVolume(+e.target.value)}
            className="flex-1" style={{ accentColor: '#8b5cf6' }} />
          <span className="text-purple-400 text-[10px] w-6">{masterVolume}</span>
        </div>
      </div>

      {/* Master Meter */}
      {isPlaying && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-white/30 text-[9px] w-8">OUT</span>
          <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${(masterMeter / 100) * masterVolume}%`,
                background: masterMeter > 80 ? 'linear-gradient(90deg,#22c55e,#ef4444)' : 'linear-gradient(90deg,#22c55e,#86efac)',
                boxShadow: '0 0 6px rgba(34,197,94,0.5)',
              }} />
          </div>
          <span className="text-green-400 text-[9px] w-6">{Math.round((masterMeter / 100) * masterVolume)}</span>
        </div>
      )}

      {/* Add Track */}
      <button onClick={addTrack}
        className="w-full btn-secondary text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
        + Add Track
      </button>

      {/* Track Lanes */}
      <div className="space-y-2">
        {tracks.map(track => {
          const isActive = !track.muted && (!soloed || track.solo);
          const meter = meters[track.id] || 0;
          return (
            <div key={track.id}
              className={`glass-card rounded-xl p-2.5 transition-all ${track.solo ? 'border-yellow-500/50' : ''} ${track.muted ? 'opacity-50' : ''}`}>
              {/* Track header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                  style={{ background: `${track.color}30`, border: `1px solid ${track.color}60` }}>
                  {track.icon}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={track.name}
                    onChange={e => updateTrack(track.id, { name: e.target.value })}
                    className="bg-transparent text-xs text-white font-semibold outline-none w-full"
                  />
                </div>
                {/* M / S / FX */}
                <div className="flex gap-1">
                  <button onClick={() => updateTrack(track.id, { muted: !track.muted })}
                    className={`w-6 h-6 rounded text-[8px] font-bold border transition-all ${track.muted ? 'bg-orange-700/60 border-orange-500 text-orange-300' : 'border-white/15 text-white/40 hover:border-white/30'}`}>M</button>
                  <button onClick={() => updateTrack(track.id, { solo: !track.solo })}
                    className={`w-6 h-6 rounded text-[8px] font-bold border transition-all ${track.solo ? 'bg-yellow-700/60 border-yellow-500 text-yellow-300' : 'border-white/15 text-white/40 hover:border-white/30'}`}>S</button>
                  <button onClick={() => updateTrack(track.id, { fx: !track.fx })}
                    className={`w-6 h-6 rounded text-[8px] font-bold border transition-all ${track.fx ? 'bg-purple-700/60 border-purple-500 text-purple-300' : 'border-white/15 text-white/40 hover:border-white/30'}`}>FX</button>
                  <button onClick={() => deleteTrack(track.id)}
                    className="w-6 h-6 rounded text-[8px] border border-red-700/20 text-red-400/40 hover:text-red-400 hover:border-red-500 transition-all">✕</button>
                </div>
              </div>

              {/* Volume + Pan + Meter */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <div>
                  <div className="flex justify-between text-[8px] text-white/30 mb-0.5">
                    <span>VOL</span><span style={{ color: track.color }}>{track.volume}</span>
                  </div>
                  <input type="range" min={0} max={100} value={track.volume}
                    onChange={e => updateTrack(track.id, { volume: +e.target.value })}
                    className="w-full" style={{ accentColor: track.color }} />
                </div>
                <div>
                  <div className="flex justify-between text-[8px] text-white/30 mb-0.5">
                    <span>PAN</span><span>{track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}</span>
                  </div>
                  <input type="range" min={-50} max={50} value={track.pan}
                    onChange={e => updateTrack(track.id, { pan: +e.target.value })}
                    className="w-full" style={{ accentColor: track.color }} />
                </div>
                {/* VU Meter */}
                <div className="flex gap-0.5 h-8 items-end">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: isActive && isPlaying ? `${Math.min(100, (meter / 100) * (i < 10 ? 80 : 100))}%` : '5%',
                        background: i >= 10 ? '#ef4444' : i >= 8 ? '#f59e0b' : track.color,
                        opacity: isActive ? 1 : 0.2,
                        transition: 'height 0.08s ease',
                      }} />
                  ))}
                </div>
              </div>

              {/* Gain */}
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[8px] text-white/30">GAIN</span>
                <input type="range" min={-12} max={12} value={track.gain}
                  onChange={e => updateTrack(track.id, { gain: +e.target.value })}
                  className="flex-1" style={{ accentColor: '#06b6d4' }} />
                <span className="text-cyan-400 text-[9px] w-8">{track.gain > 0 ? '+' : ''}{track.gain} dB</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Mix */}
      <div className="glass-card rounded-xl p-3 flex gap-2">
        <button className="flex-1 btn-primary text-white py-2 rounded-xl text-xs font-bold">
          🎚️ Export Mix (WAV)
        </button>
        <button className="flex-1 btn-secondary text-white py-2 rounded-xl text-xs font-bold">
          💾 Save Project
        </button>
      </div>
    </div>
  );
};

export default MultiTrackMixer;
