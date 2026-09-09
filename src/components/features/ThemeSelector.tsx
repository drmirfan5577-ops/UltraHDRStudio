import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  activeTheme: string;
  onSelectTheme: (id: string) => void;
}

export interface StudioTheme {
  id: string;
  name: string;
  category: 'dark' | 'light' | 'neon' | 'nature' | 'cosmic' | 'gold';
  bg: string;
  panel: string;
  accent: string;
  text: string;
  border: string;
  preview: string;
  desc: string;
  isDark: boolean;
}

export const STUDIO_THEMES: StudioTheme[] = [
  // DARK themes
  { id: 'deep-space', name: 'Deep Space', category: 'dark', isDark: true, desc: 'Deep black cosmos with purple starfield',
    bg: 'radial-gradient(ellipse at 30% 40%, rgba(88,28,135,0.6) 0%, rgba(5,8,20,1) 70%)', panel: 'rgba(10,5,30,0.85)', accent: '#8b5cf6', text: '#e2e8f0', border: 'rgba(139,92,246,0.3)', preview: 'linear-gradient(135deg,#0a051e,#1a0a3e)' },
  { id: 'midnight-black', name: 'Midnight Black', category: 'dark', isDark: true, desc: 'Pure obsidian black studio darkness',
    bg: 'linear-gradient(135deg, #000000 0%, #0a0a0f 100%)', panel: 'rgba(8,8,12,0.9)', accent: '#a855f7', text: '#e2e8f0', border: 'rgba(168,85,247,0.3)', preview: 'linear-gradient(135deg,#000000,#0d0d18)' },
  { id: 'carbon-fiber', name: 'Carbon Fiber', category: 'dark', isDark: true, desc: 'Industrial carbon with steel accents',
    bg: 'repeating-linear-gradient(45deg, #0a0a0a 0, #111 2px, #0a0a0a 4px)', panel: 'rgba(15,15,15,0.9)', accent: '#64748b', text: '#cbd5e1', border: 'rgba(100,116,139,0.3)', preview: 'linear-gradient(135deg,#0a0a0a,#1a1a1a)' },
  { id: 'dark-crimson', name: 'Dark Crimson', category: 'dark', isDark: true, desc: 'Blood red dark professional theme',
    bg: 'radial-gradient(ellipse at 50% 0%, rgba(127,29,29,0.7) 0%, rgba(5,2,2,1) 70%)', panel: 'rgba(20,5,5,0.9)', accent: '#ef4444', text: '#fecaca', border: 'rgba(239,68,68,0.3)', preview: 'linear-gradient(135deg,#140505,#2d0a0a)' },
  { id: 'dark-emerald', name: 'Dark Emerald', category: 'dark', isDark: true, desc: 'Deep jungle green with teal highlights',
    bg: 'radial-gradient(ellipse at 40% 60%, rgba(6,78,59,0.6) 0%, rgba(2,10,5,1) 70%)', panel: 'rgba(2,12,6,0.9)', accent: '#10b981', text: '#d1fae5', border: 'rgba(16,185,129,0.3)', preview: 'linear-gradient(135deg,#020c06,#041a0d)' },
  { id: 'void-purple', name: 'Void Purple', category: 'dark', isDark: true, desc: 'Deep void with cosmic purple energy',
    bg: 'radial-gradient(ellipse at center, rgba(76,29,149,0.5) 0%, #000000 70%)', panel: 'rgba(10,3,25,0.9)', accent: '#7c3aed', text: '#ddd6fe', border: 'rgba(124,58,237,0.35)', preview: 'linear-gradient(135deg,#0a0319,#160632)' },

  // LIGHT themes
  { id: 'pure-white', name: 'Crystal White', category: 'light', isDark: false, desc: 'Clean studio white with glass elements',
    bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', panel: 'rgba(255,255,255,0.7)', accent: '#7c3aed', text: '#1e293b', border: 'rgba(0,0,0,0.08)', preview: 'linear-gradient(135deg,#f8fafc,#e2e8f0)' },
  { id: 'pearl-light', name: 'Pearl Studio', category: 'light', isDark: false, desc: 'Warm pearl white professional look',
    bg: 'radial-gradient(ellipse at top, #fafaf9 0%, #f5f0e8 100%)', panel: 'rgba(255,252,240,0.8)', accent: '#d97706', text: '#1c1917', border: 'rgba(0,0,0,0.07)', preview: 'linear-gradient(135deg,#fafaf9,#f0e8d8)' },
  { id: 'silver-glass', name: 'Silver Glass', category: 'light', isDark: false, desc: 'Sleek silver metallic surface look',
    bg: 'linear-gradient(135deg, #f0f4f8 0%, #dde3ea 100%)', panel: 'rgba(230,236,242,0.8)', accent: '#475569', text: '#0f172a', border: 'rgba(0,0,0,0.1)', preview: 'linear-gradient(135deg,#f0f4f8,#dde3ea)' },
  { id: 'rose-light', name: 'Rose Cream', category: 'light', isDark: false, desc: 'Warm rose and cream light palette',
    bg: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)', panel: 'rgba(255,241,245,0.8)', accent: '#e11d48', text: '#881337', border: 'rgba(225,29,72,0.15)', preview: 'linear-gradient(135deg,#fff1f2,#fce7f3)' },
  { id: 'sky-light', name: 'Sky Blue', category: 'light', isDark: false, desc: 'Crisp sky blue with cloud-white panels',
    bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', panel: 'rgba(240,249,255,0.8)', accent: '#0284c7', text: '#0c4a6e', border: 'rgba(2,132,199,0.15)', preview: 'linear-gradient(135deg,#f0f9ff,#bae6fd)' },

  // NEON themes
  { id: 'neon-cyberpunk', name: 'Cyberpunk Neon', category: 'neon', isDark: true, desc: 'Electric cyberpunk city neon glow',
    bg: 'linear-gradient(180deg, #000010 0%, #0d0020 40%, #000510 100%)', panel: 'rgba(0,0,20,0.85)', accent: '#f0f', text: '#00ffff', border: 'rgba(255,0,255,0.4)', preview: 'linear-gradient(135deg,#000010,#0d0020)' },
  { id: 'neon-blue', name: 'Neon Electric Blue', category: 'neon', isDark: true, desc: 'Blazing electric blue neon pulses',
    bg: 'radial-gradient(ellipse at center, rgba(0,100,255,0.2) 0%, #000010 70%)', panel: 'rgba(0,5,30,0.88)', accent: '#00d4ff', text: '#a5f3fc', border: 'rgba(0,212,255,0.35)', preview: 'linear-gradient(135deg,#000010,#001040)' },
  { id: 'neon-green', name: 'Neon Matrix Green', category: 'neon', isDark: true, desc: 'Matrix-style neon green hacker vibe',
    bg: 'radial-gradient(ellipse at center, rgba(0,80,20,0.3) 0%, #000500 70%)', panel: 'rgba(0,10,2,0.9)', accent: '#00ff41', text: '#00ff41', border: 'rgba(0,255,65,0.3)', preview: 'linear-gradient(135deg,#000500,#001800)' },
  { id: 'neon-orange', name: 'Neon Lava', category: 'neon', isDark: true, desc: 'Blazing orange lava neon glow',
    bg: 'radial-gradient(ellipse at 50% 80%, rgba(200,50,0,0.4) 0%, #050000 70%)', panel: 'rgba(15,3,0,0.9)', accent: '#ff6600', text: '#fed7aa', border: 'rgba(255,102,0,0.35)', preview: 'linear-gradient(135deg,#050000,#1a0500)' },
  { id: 'neon-pink', name: 'Neon Hot Pink', category: 'neon', isDark: true, desc: 'Vibrant hot pink neon studio energy',
    bg: 'radial-gradient(ellipse at 50% 30%, rgba(200,0,100,0.3) 0%, #050010 70%)', panel: 'rgba(10,0,15,0.9)', accent: '#ff007f', text: '#fce7f3', border: 'rgba(255,0,127,0.35)', preview: 'linear-gradient(135deg,#050010,#1a0020)' },

  // COSMIC themes
  { id: 'galaxy-ultra', name: 'Ultra Galaxy', category: 'cosmic', isDark: true, desc: 'Ultra-vibrant cosmic galaxy explosion',
    bg: 'radial-gradient(ellipse at 25% 35%, rgba(139,92,246,0.7) 0%, rgba(6,182,212,0.4) 40%, rgba(5,8,20,1) 70%)', panel: 'rgba(5,8,20,0.85)', accent: '#a78bfa', text: '#e0e7ff', border: 'rgba(167,139,250,0.35)', preview: 'linear-gradient(135deg,#050814,#160a40)' },
  { id: 'nebula-drift', name: 'Nebula Drift', category: 'cosmic', isDark: true, desc: 'Drifting space nebula in deep cosmos',
    bg: 'radial-gradient(ellipse at 60% 40%, rgba(236,72,153,0.4) 0%, rgba(139,92,246,0.3) 50%, rgba(5,8,20,1) 80%)', panel: 'rgba(5,3,15,0.88)', accent: '#f472b6', text: '#fce7f3', border: 'rgba(244,114,182,0.3)', preview: 'linear-gradient(135deg,#05030f,#1e0a2e)' },
  { id: 'aurora-cosmic', name: 'Aurora Cosmic', category: 'cosmic', isDark: true, desc: 'Northern lights meets cosmic starfield',
    bg: 'linear-gradient(180deg, #020815 0%, rgba(6,78,59,0.3) 30%, rgba(6,182,212,0.2) 60%, #020815 100%)', panel: 'rgba(2,8,21,0.88)', accent: '#34d399', text: '#d1fae5', border: 'rgba(52,211,153,0.3)', preview: 'linear-gradient(135deg,#020815,#052015)' },
  { id: 'stardust', name: 'Stardust Gold', category: 'cosmic', isDark: true, desc: 'Golden stardust floating in space',
    bg: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.35) 0%, rgba(180,83,9,0.2) 40%, rgba(5,8,20,1) 70%)', panel: 'rgba(10,5,0,0.88)', accent: '#fbbf24', text: '#fef3c7', border: 'rgba(251,191,36,0.3)', preview: 'linear-gradient(135deg,#0a0500,#1a0e00)' },
  { id: 'plasma-storm', name: 'Plasma Storm', category: 'cosmic', isDark: true, desc: 'Raging plasma energy in dark space',
    bg: 'radial-gradient(ellipse at 70% 30%, rgba(124,58,237,0.5) 0%, rgba(239,68,68,0.25) 40%, rgba(5,8,20,1) 70%)', panel: 'rgba(8,3,18,0.9)', accent: '#c084fc', text: '#f3e8ff', border: 'rgba(192,132,252,0.35)', preview: 'linear-gradient(135deg,#08031a,#1e0640)' },

  // GOLD/PREMIUM
  { id: 'gold-luxury', name: 'Gold Luxury', category: 'gold', isDark: true, desc: 'Ultra-premium gold black luxury brand',
    bg: 'radial-gradient(ellipse at 50% 0%, rgba(180,130,0,0.5) 0%, rgba(5,3,0,1) 70%)', panel: 'rgba(10,6,0,0.9)', accent: '#fbbf24', text: '#fef9c3', border: 'rgba(251,191,36,0.4)', preview: 'linear-gradient(135deg,#0a0600,#1a1000)' },
  { id: 'platinum-elite', name: 'Platinum Elite', category: 'gold', isDark: true, desc: 'Sleek platinum with silver luminance',
    bg: 'radial-gradient(ellipse at center, rgba(148,163,184,0.2) 0%, rgba(5,8,20,1) 70%)', panel: 'rgba(8,12,20,0.9)', accent: '#cbd5e1', text: '#f1f5f9', border: 'rgba(203,213,225,0.25)', preview: 'linear-gradient(135deg,#080c14,#141e2c)' },
  { id: 'rose-gold-dark', name: 'Rose Gold Dark', category: 'gold', isDark: true, desc: 'Romantic rose gold meets dark glass',
    bg: 'radial-gradient(ellipse at 40% 30%, rgba(244,114,182,0.3) 0%, rgba(180,83,9,0.2) 40%, rgba(5,3,6,1) 70%)', panel: 'rgba(12,4,8,0.9)', accent: '#fb7185', text: '#fce7f3', border: 'rgba(251,113,133,0.3)', preview: 'linear-gradient(135deg,#0c0408,#20080e)' },

  // NATURE
  { id: 'forest-night', name: 'Forest Night', category: 'nature', isDark: true, desc: 'Misty forest at night with fireflies',
    bg: 'radial-gradient(ellipse at 30% 70%, rgba(20,83,45,0.5) 0%, rgba(5,12,5,1) 70%)', panel: 'rgba(3,10,4,0.9)', accent: '#4ade80', text: '#dcfce7', border: 'rgba(74,222,128,0.25)', preview: 'linear-gradient(135deg,#030a04,#0a1e0c)' },
  { id: 'ocean-deep', name: 'Ocean Abyss', category: 'nature', isDark: true, desc: 'Deep ocean trench with bioluminescence',
    bg: 'radial-gradient(ellipse at 50% 80%, rgba(3,105,161,0.5) 0%, rgba(0,5,20,1) 70%)', panel: 'rgba(0,5,20,0.9)', accent: '#22d3ee', text: '#cffafe', border: 'rgba(34,211,238,0.25)', preview: 'linear-gradient(135deg,#000514,#001a40)' },
  { id: 'sunset-warm', name: 'Sunset Warm', category: 'nature', isDark: true, desc: 'Golden hour sunset warm gradients',
    bg: 'linear-gradient(180deg, #1a0a00 0%, rgba(194,65,12,0.5) 40%, rgba(251,146,60,0.3) 70%, rgba(5,2,0,1) 100%)', panel: 'rgba(20,8,0,0.9)', accent: '#fb923c', text: '#fed7aa', border: 'rgba(251,146,60,0.3)', preview: 'linear-gradient(135deg,#1a0a00,#301500)' },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: '✨ All',
  dark: '🌑 Dark',
  light: '☀️ Light',
  neon: '💜 Neon',
  cosmic: '🌌 Cosmic',
  gold: '🥇 Premium',
  nature: '🌿 Nature',
};

const ThemeSelector: React.FC<Props> = ({ onClose, activeTheme, onSelectTheme }) => {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = STUDIO_THEMES.filter(t =>
    (category === 'all' || t.category === category) &&
    (search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-yellow-300" style={{ textShadow: '0 0 20px rgba(245,158,11,0.6)' }}>
          🎨 Themes & Live Backgrounds
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Active Theme Badge */}
      <div className="glass-panel-bright rounded-xl p-2.5 flex items-center gap-2.5" style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <div className="w-full h-full" style={{ background: STUDIO_THEMES.find(t => t.id === activeTheme)?.preview || '#050814' }} />
        </div>
        <div className="flex-1">
          <p className="text-yellow-300 text-[11px] font-bold">{STUDIO_THEMES.find(t => t.id === activeTheme)?.name || 'Default Theme'}</p>
          <p className="text-white/30 text-[9px]">Active Theme · {STUDIO_THEMES.length} total available</p>
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Search themes..."
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-yellow-500/50"
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setCategory(key)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${category === key ? 'bg-yellow-900/30 border-yellow-500/60 text-yellow-300' : 'border-white/8 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map(theme => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className={`relative rounded-xl overflow-hidden border transition-all text-left group ${activeTheme === theme.id ? 'ring-2 ring-yellow-400' : 'border-white/8 hover:border-white/25'}`}
            style={{ border: activeTheme === theme.id ? `2px solid ${theme.accent}` : undefined }}
          >
            {/* Preview */}
            <div className="h-16 relative" style={{ background: theme.bg }}>
              {/* Mini panels */}
              <div className="absolute inset-2 rounded-lg flex gap-1 p-1"
                style={{ background: theme.panel, border: `1px solid ${theme.border}` }}>
                <div className="flex-1 rounded-sm opacity-40" style={{ background: theme.accent }} />
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="h-1.5 rounded-sm opacity-30" style={{ background: theme.text }} />
                  <div className="h-1 rounded-sm opacity-20" style={{ background: theme.text }} />
                  <div className="h-1 rounded-sm opacity-15 w-2/3" style={{ background: theme.text }} />
                </div>
              </div>
              {activeTheme === theme.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
                  style={{ background: theme.accent }}>✓</div>
              )}
              {/* Category badge */}
              <div className="absolute bottom-1.5 left-1.5 text-[7px] px-1 rounded font-bold"
                style={{ background: `${theme.accent}30`, color: theme.accent, border: `1px solid ${theme.accent}40` }}>
                {theme.category.toUpperCase()}
              </div>
            </div>
            {/* Label */}
            <div className="p-2">
              <p className="text-[10px] font-bold text-white/90 leading-tight">{theme.name}</p>
              <p className="text-[8px] text-white/35 mt-0.5 leading-tight line-clamp-1">{theme.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-6">
          <p className="text-white/30 text-sm">No themes match your search</p>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
