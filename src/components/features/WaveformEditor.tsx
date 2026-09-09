import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  onClose: () => void;
}

const TRACKS_DATA = [
  { name: 'Studio Session 01', duration: '4:23', format: 'WAV 320kbps', color: '#8b5cf6' },
  { name: 'Vocal Take — Final', duration: '3:12', format: 'MP3 256kbps', color: '#06b6d4' },
  { name: 'Background Mix v3', duration: '5:48', format: 'FLAC Lossless', color: '#ec4899' },
];

interface Region {
  start: number;
  end: number;
  label: string;
  color: string;
}

const WaveformEditor: React.FC<Props> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playhead, setPlayhead] = useState(0.28);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [regions, setRegions] = useState<Region[]>([
    { start: 0.1, end: 0.35, label: 'Intro', color: 'rgba(139,92,246,0.35)' },
    { start: 0.45, end: 0.75, label: 'Chorus', color: 'rgba(6,182,212,0.35)' },
    { start: 0.82, end: 0.97, label: 'Outro', color: 'rgba(245,158,11,0.35)' },
  ]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const playInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = TRACKS_DATA[selectedTrack];
  const canvasColor = track.color;

  // Generate waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(5,8,20,0.8)';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (H / 8) * i);
      ctx.lineTo(W, (H / 8) * i);
      ctx.stroke();
    }

    // Regions
    regions.forEach(r => {
      ctx.fillStyle = r.color;
      ctx.fillRect(r.start * W, 0, (r.end - r.start) * W, H);
    });

    // Selection
    if (selectionStart !== null && selectionEnd !== null) {
      const s = Math.min(selectionStart, selectionEnd);
      const e = Math.max(selectionStart, selectionEnd);
      ctx.fillStyle = 'rgba(245,158,11,0.25)';
      ctx.fillRect(s * W, 0, (e - s) * W, H);
      ctx.strokeStyle = 'rgba(245,158,11,0.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(s * W, 0, (e - s) * W, H);
    }

    // Waveform bars
    const bars = Math.floor(W / (2 / zoom));
    for (let i = 0; i < bars; i++) {
      const x = (i / bars) * W;
      const seed = Math.sin(i * 0.3 + selectedTrack * 17) * 0.5 + 0.5;
      const seed2 = Math.cos(i * 0.7 + selectedTrack * 5) * 0.3 + 0.5;
      const amp = (seed * 0.6 + seed2 * 0.4) * (H / 2) * 0.85;

      const progress = x / W;
      const isPast = progress < playhead;

      // Upper
      ctx.fillStyle = isPast ? canvasColor : `${canvasColor}60`;
      ctx.fillRect(x, H / 2 - amp, 1.5, amp);
      // Lower
      ctx.fillStyle = isPast ? `${canvasColor}80` : `${canvasColor}30`;
      ctx.fillRect(x, H / 2, 1.5, amp * 0.6);
    }

    // Center line
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // Playhead
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(playhead * W, 0);
    ctx.lineTo(playhead * W, H);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Playhead triangle
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(playhead * W - 5, 0);
    ctx.lineTo(playhead * W + 5, 0);
    ctx.lineTo(playhead * W, 8);
    ctx.fill();

    // Region labels
    ctx.font = '9px Inter, sans-serif';
    regions.forEach(r => {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(r.label, r.start * W + 4, 14);
    });
  }, [playhead, zoom, regions, selectionStart, selectionEnd, selectedTrack, canvasColor]);

  useEffect(() => { drawWaveform(); }, [drawWaveform]);

  useEffect(() => {
    if (isPlaying) {
      playInterval.current = setInterval(() => {
        setPlayhead(p => {
          if (p >= 1) { setIsPlaying(false); return 0; }
          return +(p + 0.002).toFixed(4);
        });
      }, 50);
    } else {
      if (playInterval.current) clearInterval(playInterval.current);
    }
    return () => { if (playInterval.current) clearInterval(playInterval.current); };
  }, [isPlaying]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setPlayhead(Math.max(0, Math.min(1, x)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setSelectionStart(x);
    setSelectionEnd(x);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setSelectionEnd(Math.max(0, Math.min(1, x)));
  };

  const handleMouseUp = () => setIsDragging(false);

  const applyFade = (type: 'in' | 'out') => {
    console.log(`Applying fade ${type}`);
  };

  const applyCut = () => {
    if (selectionStart === null || selectionEnd === null) return;
    setSelectionStart(null);
    setSelectionEnd(null);
    console.log('Cut applied');
  };

  const addRegion = () => {
    if (selectionStart === null || selectionEnd === null) return;
    const s = Math.min(selectionStart, selectionEnd);
    const e = Math.max(selectionStart, selectionEnd);
    const colors = ['rgba(139,92,246,0.35)', 'rgba(6,182,212,0.35)', 'rgba(16,185,129,0.35)', 'rgba(236,72,153,0.35)'];
    setRegions(prev => [...prev, { start: s, end: e, label: `Region ${prev.length + 1}`, color: colors[prev.length % colors.length] }]);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const formatTime = (ratio: number) => {
    const totalSecs = ratio * 263; // 4:23
    const m = Math.floor(totalSecs / 60);
    const s = Math.floor(totalSecs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-purple-300 glow-text-purple">〰️ Waveform Editor</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Track Selector */}
      <div className="space-y-1.5">
        {TRACKS_DATA.map((t, i) => (
          <button key={i} onClick={() => setSelectedTrack(i)}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl border transition-all text-left ${selectedTrack === i ? 'bg-white/8 border-white/20' : 'border-white/6 bg-white/3 hover:bg-white/6'}`}>
            <div className="w-2 h-8 rounded-full" style={{ background: t.color }} />
            <div className="flex-1">
              <p className="text-white text-xs font-medium">{t.name}</p>
              <p className="text-white/30 text-[9px]">{t.duration} · {t.format}</p>
            </div>
            {selectedTrack === i && <span style={{ color: t.color }} className="text-xs">▶</span>}
          </button>
        ))}
      </div>

      {/* Waveform Canvas */}
      <div className="rounded-xl overflow-hidden neon-border-purple">
        <canvas
          ref={canvasRef}
          width={380}
          height={100}
          className="w-full cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ display: 'block' }}
        />
        {/* Time ruler */}
        <div className="flex justify-between px-2 py-0.5 bg-black/30">
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <span key={t} className="text-[8px] text-white/20 font-mono">{formatTime(t)}</span>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button onClick={() => setPlayhead(0)} className="w-8 h-8 rounded-full bg-white/10 text-white/50 hover:bg-white/20 flex items-center justify-center text-sm">⏮</button>
        <button onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: `linear-gradient(135deg, #5b21b6, #7c3aed)`, boxShadow: '0 0 15px rgba(139,92,246,0.5)' }}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={() => { setIsPlaying(false); setPlayhead(0); }} className="w-8 h-8 rounded-full bg-white/10 text-white/50 hover:bg-white/20 flex items-center justify-center text-sm">⏹</button>
        <span className="text-purple-400 text-xs font-mono">{formatTime(playhead)}</span>

        {/* Zoom */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-white/30 text-[9px]">Zoom</span>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.5))}
            className="w-6 h-6 rounded bg-white/10 text-white/50 text-xs hover:bg-white/20">−</button>
          <span className="text-white/50 text-[10px] w-6 text-center">{zoom}x</span>
          <button onClick={() => setZoom(z => Math.min(4, z + 0.5))}
            className="w-6 h-6 rounded bg-white/10 text-white/50 text-xs hover:bg-white/20">+</button>
        </div>
      </div>

      {/* Edit Tools */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-cyan-300 text-xs font-bold">✂️ Edit Tools</p>
        <p className="text-white/30 text-[9px]">Drag on waveform to select region, then apply:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '✂️ Cut Selection', action: applyCut, color: '#ef4444' },
            { label: '📌 Mark Region', action: addRegion, color: '#8b5cf6' },
            { label: '🌅 Fade In', action: () => applyFade('in'), color: '#06b6d4' },
            { label: '🌇 Fade Out', action: () => applyFade('out'), color: '#f59e0b' },
          ].map(tool => (
            <button key={tool.label} onClick={tool.action}
              className="p-2 rounded-xl border text-[10px] font-bold text-white/70 hover:text-white transition-all hover:bg-white/8"
              style={{ borderColor: `${tool.color}40` }}
              disabled={selectionStart === null || selectionEnd === null}>
              {tool.label}
            </button>
          ))}
        </div>
        {selectionStart !== null && selectionEnd !== null && (
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-2 text-center">
            <p className="text-yellow-400 text-[10px]">
              Selection: {formatTime(Math.min(selectionStart, selectionEnd))} → {formatTime(Math.max(selectionStart, selectionEnd))}
            </p>
          </div>
        )}
      </div>

      {/* Regions */}
      {regions.length > 0 && (
        <div className="glass-card rounded-xl p-3">
          <p className="text-green-400 text-xs font-bold mb-2">📌 Markers & Regions</p>
          <div className="space-y-1">
            {regions.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: r.color }} />
                <span className="text-white/60 text-[10px] flex-1">{r.label}</span>
                <span className="text-white/30 text-[9px]">{formatTime(r.start)} → {formatTime(r.end)}</span>
                <button onClick={() => setRegions(prev => prev.filter((_, j) => j !== i))}
                  className="text-red-400/40 hover:text-red-400 text-[9px]">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export */}
      <div className="flex gap-2">
        <button className="flex-1 btn-primary text-white py-2 rounded-xl text-xs font-bold">💾 Export Edited</button>
        <button className="flex-1 btn-secondary text-white py-2 rounded-xl text-xs font-bold">↩️ Undo All</button>
      </div>
    </div>
  );
};

export default WaveformEditor;
