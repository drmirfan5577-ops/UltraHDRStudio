import React, { useState, useRef } from 'react';

interface Props {
  onClose: () => void;
}

const FONT_STYLES = [
  { id: 'orbitron', label: 'Orbitron', family: 'Orbitron, monospace' },
  { id: 'inter', label: 'Inter', family: 'Inter, sans-serif' },
  { id: 'serif', label: 'Serif Classic', family: 'Georgia, serif' },
  { id: 'mono', label: 'Monospace', family: 'monospace' },
  { id: 'cursive', label: 'Cursive', family: 'cursive' },
];

const TEXT_EFFECTS = [
  { id: 'glow-purple', label: 'Purple Glow', style: { textShadow: '0 0 20px rgba(139,92,246,0.9), 0 0 40px rgba(139,92,246,0.5)', color: '#c084fc' } },
  { id: 'glow-cyan', label: 'Cyan Glow', style: { textShadow: '0 0 20px rgba(6,182,212,0.9), 0 0 40px rgba(6,182,212,0.5)', color: '#67e8f9' } },
  { id: 'glow-gold', label: 'Gold Glow', style: { textShadow: '0 0 20px rgba(245,158,11,0.9), 0 0 40px rgba(245,158,11,0.5)', color: '#fcd34d' } },
  { id: 'neon-pink', label: 'Neon Pink', style: { textShadow: '0 0 20px rgba(236,72,153,1), 0 0 40px rgba(236,72,153,0.6)', color: '#f472b6' } },
  { id: 'white-clean', label: 'Clean White', style: { color: '#ffffff', textShadow: 'none' } },
  { id: 'gradient', label: 'Gradient', style: { background: 'linear-gradient(90deg, #a78bfa, #67e8f9, #fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } },
];

const BG_PRESETS = [
  { id: 'dark', label: 'Deep Dark', bg: 'linear-gradient(135deg, #050814, #0a0f1e)' },
  { id: 'purple', label: 'Purple Nebula', bg: 'radial-gradient(ellipse at center, rgba(139,92,246,0.6), #050814)' },
  { id: 'cyan', label: 'Cyan Crystal', bg: 'radial-gradient(ellipse at center, rgba(6,182,212,0.5), #050814)' },
  { id: 'gold', label: 'Gold Studio', bg: 'radial-gradient(ellipse at center, rgba(245,158,11,0.5), #050814)' },
  { id: 'aurora', label: 'Aurora', bg: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(6,182,212,0.4), rgba(139,92,246,0.4))' },
  { id: 'transparent', label: 'Transparent', bg: 'transparent' },
];

const LOGO_SHAPES = ['⬟', '⬡', '◉', '◈', '🔷', '💎', '⭐', '🌟'];

const ImageLogoCreator: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'title' | 'header' | 'footer'>('logo');
  const [text, setText] = useState('E.S wOrLd');
  const [subText, setSubText] = useState('EvEr-SmArT-wOrLd');
  const [selectedFont, setSelectedFont] = useState('orbitron');
  const [selectedEffect, setSelectedEffect] = useState('glow-purple');
  const [selectedBg, setSelectedBg] = useState('dark');
  const [fontSize, setFontSize] = useState(32);
  const [letterSpacing, setLetterSpacing] = useState(2);
  const [selectedShape, setSelectedShape] = useState('💎');
  const [showShape, setShowShape] = useState(true);
  const [borderGlow, setBorderGlow] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const fontObj = FONT_STYLES.find(f => f.id === selectedFont);
  const effectObj = TEXT_EFFECTS.find(e => e.id === selectedEffect);
  const bgObj = BG_PRESETS.find(b => b.id === selectedBg);

  const exportFormats = ['PNG', 'SVG', 'JPG', 'WEBP'];
  const [exportFmt, setExportFmt] = useState('PNG');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-yellow-300 glow-text-gold">🎨 Image & Logo Creator</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {(['logo', 'title', 'header', 'footer'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all capitalize ${activeTab === tab ? 'bg-yellow-600/50 border border-yellow-500/60 text-yellow-300' : 'text-white/40 hover:text-white/70'}`}>
            {tab === 'logo' ? '🏷️' : tab === 'title' ? '📝' : tab === 'header' ? '⬆️' : '⬇️'} {tab}
          </button>
        ))}
      </div>

      {/* Live Preview */}
      <div
        ref={previewRef}
        className={`relative rounded-xl overflow-hidden flex flex-col items-center justify-center transition-all ${borderGlow ? 'neon-border-purple' : 'border border-white/10'}`}
        style={{
          minHeight: activeTab === 'logo' ? 140 : 100,
          background: bgObj?.bg || '#050814',
          padding: '24px 16px',
        }}
      >
        {activeTab === 'logo' && showShape && (
          <div className="text-4xl mb-2" style={{ filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.8))' }}>
            {selectedShape}
          </div>
        )}
        <div
          style={{
            fontFamily: fontObj?.family,
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}px`,
            lineHeight: 1.2,
            textAlign: 'center',
            fontWeight: 700,
            ...effectObj?.style,
          }}
        >
          {text || 'Your Text Here'}
        </div>
        {subText && (
          <div
            style={{
              fontFamily: fontObj?.family,
              fontSize: `${Math.max(fontSize * 0.45, 11)}px`,
              letterSpacing: `${letterSpacing * 0.7}px`,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 6,
              textAlign: 'center',
            }}
          >
            {subText}
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 text-[8px] bg-black/50 text-white/30 rounded px-1.5 py-0.5">
          Preview
        </div>
      </div>

      {/* Text Inputs */}
      <div className="space-y-2">
        <div>
          <label className="text-cyan-300 text-[10px] font-bold">Main Text</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-yellow-500/50" />
        </div>
        <div>
          <label className="text-cyan-300 text-[10px] font-bold">Sub Text / Tagline</label>
          <input type="text" value={subText} onChange={e => setSubText(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-yellow-500/50" />
        </div>
      </div>

      {/* Font Selector */}
      <div>
        <p className="text-purple-300 text-xs font-bold mb-2">🔤 Font Style</p>
        <div className="flex flex-wrap gap-1.5">
          {FONT_STYLES.map(f => (
            <button key={f.id} onClick={() => setSelectedFont(f.id)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${selectedFont === f.id ? 'bg-purple-700/40 border-purple-500 text-purple-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}
              style={{ fontFamily: f.family }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Effects */}
      <div>
        <p className="text-yellow-300 text-xs font-bold mb-2">✨ Text Effect</p>
        <div className="grid grid-cols-3 gap-1.5">
          {TEXT_EFFECTS.map(e => (
            <button key={e.id} onClick={() => setSelectedEffect(e.id)}
              className={`text-[9px] py-1.5 px-1 rounded-xl border text-center transition-all ${selectedEffect === e.id ? 'bg-white/15 border-yellow-500/60' : 'border-white/8 bg-white/3 hover:bg-white/8'}`}
              style={e.style as React.CSSProperties}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background */}
      <div>
        <p className="text-green-400 text-xs font-bold mb-2">🌌 Background</p>
        <div className="grid grid-cols-3 gap-1.5">
          {BG_PRESETS.map(b => (
            <button key={b.id} onClick={() => setSelectedBg(b.id)}
              className={`relative h-10 rounded-xl border transition-all overflow-hidden ${selectedBg === b.id ? 'border-green-500 scale-105' : 'border-white/10 hover:border-white/25'}`}
              style={{ background: b.bg }}>
              <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${selectedBg === b.id ? 'text-white' : 'text-white/60'}`}>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logo Shape */}
      {activeTab === 'logo' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-indigo-300 text-xs font-bold">🔷 Logo Shape/Icon</p>
            <button onClick={() => setShowShape(!showShape)}
              className={`text-[9px] px-2 py-0.5 rounded-full border transition-all ${showShape ? 'bg-indigo-700/40 border-indigo-500 text-indigo-300' : 'border-white/15 text-white/40'}`}>
              {showShape ? 'Shown' : 'Hidden'}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {LOGO_SHAPES.map(s => (
              <button key={s} onClick={() => setSelectedShape(s)}
                className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all ${selectedShape === s ? 'bg-indigo-700/40 border-indigo-500 scale-110' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Controls */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-pink-300 text-xs font-bold">📏 Typography Controls</p>
        {[
          { label: 'Font Size', val: fontSize, set: setFontSize, min: 12, max: 80, color: '#ec4899' },
          { label: 'Letter Spacing', val: letterSpacing, set: setLetterSpacing, min: 0, max: 20, color: '#8b5cf6' },
        ].map(ctrl => (
          <div key={ctrl.label}>
            <div className="flex justify-between text-[10px] text-white/50 mb-1">
              <span>{ctrl.label}</span>
              <span style={{ color: ctrl.color }}>{ctrl.val}px</span>
            </div>
            <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val}
              onChange={e => ctrl.set(Number(e.target.value))}
              className="w-full" style={{ accentColor: ctrl.color }} />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[10px]">Border Glow</span>
          <button onClick={() => setBorderGlow(!borderGlow)}
            className={`relative w-8 h-4 rounded-full transition-all ${borderGlow ? 'bg-purple-600' : 'bg-white/20'}`}>
            <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${borderGlow ? 'left-4.5' : 'left-0.5'}`} style={{ left: borderGlow ? 17 : 2 }} />
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-orange-400 text-xs font-bold mb-2">📤 Export Creation</p>
        <div className="flex gap-1.5 flex-wrap mb-2">
          {exportFormats.map(f => (
            <button key={f} onClick={() => setExportFmt(f)}
              className={`text-[10px] px-2.5 py-1 rounded-full border ${exportFmt === f ? 'bg-orange-700/40 border-orange-500 text-orange-300' : 'border-white/15 text-white/50'}`}>
              {f}
            </button>
          ))}
        </div>
        <button className="btn-primary w-full text-white py-2 rounded-xl text-xs font-bold">
          ⬇️ Download as {exportFmt}
        </button>
      </div>
    </div>
  );
};

export default ImageLogoCreator;
