import React, { useState, useRef } from 'react';

interface Props {
  onClose: () => void;
}

interface Segment {
  id: string;
  start: number;
  end: number;
  text: string;
  style: {
    color: string;
    fontSize: number;
    position: 'bottom' | 'top' | 'center';
    fontFamily: string;
    bold: boolean;
  };
}

const DEFAULT_STYLE = { color: '#ffffff', fontSize: 20, position: 'bottom' as const, fontFamily: 'Inter', bold: false };

const FONT_OPTIONS = ['Inter', 'Orbitron', 'Georgia', 'monospace', 'cursive'];
const COLORS = ['#ffffff', '#fcd34d', '#67e8f9', '#f472b6', '#86efac', '#fca5a5', '#c4b5fd'];
const POSITIONS = ['bottom', 'center', 'top'] as const;

let idCounter = 3;

const SAMPLE_SEGMENTS: Segment[] = [
  { id: '1', start: 0, end: 3.5, text: 'Welcome to Ultra HDR Plus Movie Studio', style: { ...DEFAULT_STYLE } },
  { id: '2', start: 4, end: 8, text: 'Professional audio & video editing platform', style: { ...DEFAULT_STYLE, color: '#67e8f9' } },
  { id: '3', start: 9, end: 13, text: 'By Dr M Irfan Qadir Thaheem', style: { ...DEFAULT_STYLE, color: '#fcd34d', bold: true } },
];

const formatTime = (s: number) => {
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toFixed(3).padStart(6, '0');
  return `${h}:${m}:${sec}`;
};

const toSRT = (segs: Segment[]) => segs.map((s, i) =>
  `${i + 1}\n${formatTime(s.start).replace('.', ',')} --> ${formatTime(s.end).replace('.', ',')}\n${s.text}`
).join('\n\n');

const toVTT = (segs: Segment[]) =>
  'WEBVTT\n\n' + segs.map((s, i) =>
    `${i + 1}\n${formatTime(s.start)} --> ${formatTime(s.end)}\n${s.text}`
  ).join('\n\n');

const SubtitleEditor: React.FC<Props> = ({ onClose }) => {
  const [segments, setSegments] = useState<Segment[]>(SAMPLE_SEGMENTS);
  const [selected, setSelected] = useState<string | null>('1');
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exportFmt, setExportFmt] = useState<'SRT' | 'VTT'>('SRT');
  const [exported, setExported] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalDuration = 60;

  const activeSegment = segments.find(s => playhead >= s.start && playhead <= s.end);
  const selectedSeg = segments.find(s => s.id === selected);

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setPlayhead(p => {
          if (p >= totalDuration) { clearInterval(intervalRef.current!); setIsPlaying(false); return 0; }
          return +(p + 0.1).toFixed(1);
        });
      }, 100);
    }
  };

  const addSegment = () => {
    const newId = String(++idCounter);
    const lastEnd = segments[segments.length - 1]?.end || 0;
    setSegments(prev => [...prev, {
      id: newId, start: lastEnd + 0.5, end: lastEnd + 4,
      text: 'New subtitle line', style: { ...DEFAULT_STYLE },
    }]);
    setSelected(newId);
  };

  const deleteSegment = (id: string) => {
    setSegments(prev => prev.filter(s => s.id !== id));
    if (selected === id) setSelected(null);
  };

  const updateSegment = (id: string, patch: Partial<Segment>) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const updateStyle = (id: string, styleKey: string, val: unknown) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, style: { ...s.style, [styleKey]: val } } : s));
  };

  const handleExport = () => {
    const content = exportFmt === 'SRT' ? toSRT(segments) : toVTT(segments);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtitles.${exportFmt.toLowerCase()}`;
    a.click();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const progress = (playhead / totalDuration) * 100;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-cyan-300 glow-text-cyan">🎬 Subtitle / Caption Editor</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Preview Screen */}
      <div className="relative rounded-xl overflow-hidden bg-black"
        style={{ aspectRatio: '16/9', border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 0 20px rgba(6,182,212,0.15)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/10 text-4xl">▶</span>
        </div>
        {activeSegment && (
          <div
            className="absolute left-0 right-0 px-4 py-2 flex justify-center"
            style={{
              bottom: activeSegment.style.position === 'bottom' ? 12 : undefined,
              top: activeSegment.style.position === 'top' ? 12 : undefined,
              ...(activeSegment.style.position === 'center' ? { top: '50%', transform: 'translateY(-50%)' } : {}),
            }}
          >
            <div className="bg-black/70 rounded px-3 py-1 text-center"
              style={{
                color: activeSegment.style.color,
                fontSize: activeSegment.style.fontSize * 0.55,
                fontFamily: activeSegment.style.fontFamily,
                fontWeight: activeSegment.style.bold ? 700 : 400,
                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
              }}>
              {activeSegment.text}
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 text-[8px] text-white/50 px-2 py-0.5 rounded font-mono">
          {formatTime(playhead).slice(0, -4)}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setPlayhead(0)} className="w-8 h-8 rounded-full bg-white/10 text-white/50 hover:bg-white/20 flex items-center justify-center text-sm">⏮</button>
          <button onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', boxShadow: '0 0 15px rgba(6,182,212,0.5)' }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); setIsPlaying(false); setPlayhead(0); }}
            className="w-8 h-8 rounded-full bg-white/10 text-white/50 hover:bg-white/20 flex items-center justify-center text-sm">⏹</button>
          <div className="flex-1">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
              onClick={e => {
                const r = e.currentTarget.getBoundingClientRect();
                setPlayhead(((e.clientX - r.left) / r.width) * totalDuration);
              }}>
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-700 to-cyan-400 transition-all"
                style={{ width: `${progress}%`, boxShadow: '0 0 6px rgba(6,182,212,0.6)' }} />
            </div>
          </div>
          <span className="text-[9px] text-white/30 font-mono w-12 text-right">
            {Math.floor(playhead / 60)}:{String(Math.floor(playhead % 60)).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <p className="text-yellow-300 text-xs font-bold mb-2">🕒 Timeline</p>
        <div className="relative bg-white/5 rounded-xl overflow-hidden" style={{ height: 64 }}>
          {/* Playhead */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-20 pointer-events-none transition-all"
            style={{ left: `${progress}%`, boxShadow: '0 0 6px rgba(248,113,113,0.8)' }} />
          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-2 text-[7px] text-white/20 pt-0.5">
            {[0, 15, 30, 45, 60].map(t => <span key={t}>{t}s</span>)}
          </div>
          {/* Segments */}
          {segments.map(seg => (
            <button key={seg.id}
              onClick={() => setSelected(seg.id)}
              className="absolute top-5 h-8 rounded flex items-center overflow-hidden cursor-pointer transition-all"
              style={{
                left: `${(seg.start / totalDuration) * 100}%`,
                width: `${((seg.end - seg.start) / totalDuration) * 100}%`,
                background: selected === seg.id ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.2)',
                border: selected === seg.id ? '1px solid rgba(6,182,212,0.9)' : '1px solid rgba(6,182,212,0.3)',
              }}>
              <span className="text-[8px] text-white/80 px-1 truncate">{seg.text.slice(0, 20)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Segment List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-purple-300 text-xs font-bold">📝 Segments</p>
          <button onClick={addSegment}
            className="text-[10px] btn-primary text-white px-2.5 py-1 rounded-lg font-bold">
            + Add
          </button>
        </div>
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {segments.map((seg, i) => (
            <div key={seg.id}
              onClick={() => setSelected(seg.id)}
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${selected === seg.id ? 'bg-cyan-900/30 border border-cyan-500/50' : 'bg-white/3 border border-white/6 hover:bg-white/6'}`}>
              <span className="text-[9px] text-white/30 w-3">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] truncate">{seg.text}</p>
                <p className="text-white/30 text-[8px]">{formatTime(seg.start).slice(0, -4)} → {formatTime(seg.end).slice(0, -4)}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteSegment(seg.id); }}
                className="text-red-400/50 hover:text-red-400 text-xs w-5 h-5 flex items-center justify-center">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Style Editor */}
      {selectedSeg && (
        <div className="glass-card rounded-xl p-3 space-y-3">
          <p className="text-green-400 text-xs font-bold">🎨 Style: Segment {segments.findIndex(s => s.id === selected) + 1}</p>

          {/* Text Input */}
          <div>
            <label className="text-white/40 text-[10px]">Caption Text</label>
            <textarea
              value={selectedSeg.text}
              onChange={e => updateSegment(selectedSeg.id, { text: e.target.value })}
              rows={2}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Start (s)', key: 'start', val: selectedSeg.start },
              { label: 'End (s)', key: 'end', val: selectedSeg.end },
            ].map(f => (
              <div key={f.key}>
                <label className="text-white/40 text-[9px]">{f.label}</label>
                <input type="number" step={0.1} value={f.val}
                  onChange={e => updateSegment(selectedSeg.id, { [f.key]: +e.target.value })}
                  className="w-full mt-0.5 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none focus:border-cyan-500/50"
                />
              </div>
            ))}
          </div>

          {/* Colors */}
          <div>
            <label className="text-white/40 text-[9px]">Text Color</label>
            <div className="flex gap-1.5 mt-1">
              {COLORS.map(c => (
                <button key={c} onClick={() => updateStyle(selectedSeg.id, 'color', c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${selectedSeg.style.color === c ? 'scale-125 border-white' : 'border-transparent'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Font */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-white/40 text-[9px]">Font</label>
              <select value={selectedSeg.style.fontFamily}
                onChange={e => updateStyle(selectedSeg.id, 'fontFamily', e.target.value)}
                className="w-full mt-0.5 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none">
                {FONT_OPTIONS.map(f => <option key={f} value={f} className="bg-gray-900">{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-[9px]">Position</label>
              <select value={selectedSeg.style.position}
                onChange={e => updateStyle(selectedSeg.id, 'position', e.target.value)}
                className="w-full mt-0.5 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none">
                {POSITIONS.map(p => <option key={p} value={p} className="bg-gray-900">{p}</option>)}
              </select>
            </div>
          </div>

          {/* Size + Bold */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-[9px] text-white/40 mb-1">
                <span>Font Size</span>
                <span className="text-cyan-400">{selectedSeg.style.fontSize}px</span>
              </div>
              <input type="range" min={12} max={48} value={selectedSeg.style.fontSize}
                onChange={e => updateStyle(selectedSeg.id, 'fontSize', +e.target.value)}
                className="w-full" style={{ accentColor: '#06b6d4' }} />
            </div>
            <button onClick={() => updateStyle(selectedSeg.id, 'bold', !selectedSeg.style.bold)}
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${selectedSeg.style.bold ? 'bg-cyan-700/40 border-cyan-500 text-cyan-300' : 'border-white/15 text-white/40'}`}>
              B
            </button>
          </div>
        </div>
      )}

      {/* Export */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-orange-400 text-xs font-bold">📤 Export Subtitles</p>
        <div className="flex gap-2">
          {(['SRT', 'VTT'] as const).map(f => (
            <button key={f} onClick={() => setExportFmt(f)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${exportFmt === f ? 'bg-orange-700/40 border-orange-500 text-orange-300' : 'border-white/15 text-white/40'}`}>
              .{f.toLowerCase()}
            </button>
          ))}
        </div>
        <button onClick={handleExport}
          className="w-full btn-primary text-white py-2 rounded-xl text-xs font-bold">
          {exported ? '✅ Exported!' : `⬇️ Download .${exportFmt.toLowerCase()} (${segments.length} segments)`}
        </button>
      </div>
    </div>
  );
};

export default SubtitleEditor;
