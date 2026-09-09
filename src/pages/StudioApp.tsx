
import React, { useState } from 'react';
import { MAIN_FEATURES, BACKGROUNDS_3D } from '@/constants/features';
import type { SidebarKey } from '@/types';
import Sidebar from '@/components/features/Sidebar';
import AISecretary from '@/components/features/AISecretary';
import Waveform from '@/components/features/Waveform';
import CanvasBackgroundRenderer, { CANVAS_BG_OPTIONS } from '@/components/features/CanvasBackgroundRenderer';
import { STUDIO_THEMES } from '@/components/features/ThemeSelector';
import heroImg from '@/assets/hero-studio.jpg';

const StudioApp: React.FC = () => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarKey>(null);
  const [activeBackground, setActiveBackground] = useState('nebula');
  const [activeTheme, setActiveTheme] = useState('deep-space');
  const [canvasBg, setCanvasBg] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTheme = STUDIO_THEMES.find(t => t.id === activeTheme);
  const themePanel = currentTheme?.panel || 'rgba(255,255,255,0.04)';
  const themeAccent = currentTheme?.accent || '#8b5cf6';
  const themeText = currentTheme?.text || '#e2e8f0';
  const themeBorder = currentTheme?.border || 'rgba(255,255,255,0.08)';
  const themeBg = currentTheme?.bg;

  const currentBg = BACKGROUNDS_3D.find(b => b.id === activeBackground);

  return (
    <div className="min-h-screen relative overflow-hidden particle-field" style={{ background: themeBg || currentBg?.gradient || '#050814', color: themeText }}>
      {/* Canvas 3D Background */}
      {canvasBg && <CanvasBackgroundRenderer type={canvasBg} active={true} />}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-3d-animated opacity-60" />
        {/* Crystal edge glows */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ===== TOP HEADER ===== */}
        <header className="glass-panel border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-3 py-2 flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-sm font-bold text-white glow-purple pulse-glow">
                ES
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-xs font-bold text-purple-300 glow-text-purple leading-tight">
                  E.S wOrLd
                </div>
                <div className="text-[9px] text-white/30 leading-tight">EvEr-SmArT-wOrLd</div>
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-yellow-400 leading-tight glow-text-purple"
                style={{ fontSize: 'clamp(10px, 2vw, 18px)' }}>
                Ultra HDR Plus Movie Studio
              </h1>
              <div className="text-[8px] sm:text-[10px] text-white/30">
                By Dr M Irfan Qadir Thaheem — The One Man Army
              </div>
            </div>

            {/* Waveform + Status */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Waveform bars={8} active={isPlaying} />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${isPlaying ? 'bg-purple-600 glow-purple' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={() => setActiveSidebar('theme-selector')}
                className="btn-secondary text-white text-[9px] px-2 py-1 rounded-lg font-semibold"
                title="Themes"
                style={{ borderColor: `${themeAccent}50` }}
              >
                🎨
              </button>
              <button
                onClick={() => setActiveSidebar('backgrounds')}
                className="btn-secondary text-white text-[9px] px-2 py-1 rounded-lg font-semibold"
                title="Change Background"
              >
                🌌
              </button>
              {/* Canvas BG quick toggle */}
              <div className="relative group">
                <button
                  className="btn-secondary text-white text-[9px] px-2 py-1 rounded-lg font-semibold"
                  title="3D Canvas Backgrounds"
                  onClick={() => setCanvasBg(canvasBg ? null : 'particle-galaxy')}
                >
                  {canvasBg ? '✨' : '🎆'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ===== HERO SECTION ===== */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(120px, 20vh, 200px)' }}>
          <img src={heroImg} alt="Ultra Studio" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050814]" />
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1 items-end">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      animationDelay: `${i * 0.07}s`,
                      background: `hsl(${260 + i * 8}, 80%, 65%)`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <div className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-cyan-300 leading-tight"
                  style={{ fontSize: 'clamp(14px, 3vw, 28px)' }}>
                  ULTRA HDR PLUS
                </div>
                <div className="text-yellow-400 font-bold tracking-widest"
                  style={{ fontSize: 'clamp(8px, 1.5vw, 13px)' }}>
                  PROFESSIONAL MOVIE STUDIO
                </div>
              </div>
              <div className="flex gap-1 items-end">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      animationDelay: `${i * 0.07}s`,
                      background: `hsl(${180 + i * 7}, 80%, 60%)`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <span className="text-[9px] sm:text-[10px] text-white/30 font-bold">3D/4D Canvas:</span>
              {CANVAS_BG_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCanvasBg(canvasBg === opt.id ? null : opt.id)}
                  className={`text-[9px] sm:text-[10px] bg-black/40 border px-2 py-0.5 rounded-full transition-all ${
                    canvasBg === opt.id
                      ? 'border-purple-400 text-purple-300 bg-purple-900/30'
                      : 'border-purple-500/30 text-purple-300 hover:border-purple-400'
                  }`}
                  title={opt.desc}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== MAIN FEATURE GRID ===== */}
        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-2 py-3">
          {/* Feature Cards Grid */}
          <div className="feature-grid mb-3">
            {MAIN_FEATURES.map(feat => (
              <button
                key={feat.id}
                onClick={() => setActiveSidebar(feat.sidebarKey as SidebarKey)}
                className="glass-card rounded-xl p-2.5 flex flex-col items-center gap-1.5 cursor-pointer transition-all group text-center min-h-[80px] justify-center"
                style={{
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.04)`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${feat.glowColor}, 0 0 0 1px ${feat.glowColor}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px rgba(255,255,255,0.04)`;
                }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110`}>
                  {feat.icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-[10px] sm:text-xs leading-tight">{feat.label}</div>
                  {feat.labelUrdu && (
                    <div className="text-white/30 text-[8px] leading-tight" dir="rtl">{feat.labelUrdu}</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Quick Controls */}
            <div className="glass-card rounded-xl p-3 col-span-1">
              <p className="text-yellow-300 text-[10px] font-bold mb-2">⚡ Quick Controls</p>
              <div className="space-y-2">
                {[
                  { label: 'Master Volume', val: 80, color: '#8b5cf6' },
                  { label: 'Bass', val: 65, color: '#06b6d4' },
                ].map(c => {
                  const [v, setV] = React.useState(c.val);
                  return (
                    <div key={c.label}>
                      <div className="flex justify-between text-[9px] text-white/40 mb-0.5">
                        <span>{c.label}</span>
                        <span style={{ color: c.color }}>{v}%</span>
                      </div>
                      <input type="range" min={0} max={100} value={v}
                        onChange={e => setV(Number(e.target.value))}
                        className="w-full" style={{ accentColor: c.color }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Spectrum */}
            <div className="glass-card rounded-xl p-3 col-span-1 sm:col-span-2">
              <p className="text-cyan-300 text-[10px] font-bold mb-2">📊 Live Spectrum Analyzer</p>
              <div className="flex items-end gap-0.5" style={{ height: 50 }}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all"
                    style={{
                      background: `hsl(${200 + i * 4}, 80%, 55%)`,
                      animation: `waveAnim ${0.6 + (i % 5) * 0.15}s ease-in-out infinite`,
                      animationDelay: `${i * 0.025}s`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-white/20 mt-1">
                <span>20Hz</span><span>100Hz</span><span>1kHz</span><span>10kHz</span><span>20kHz</span>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="mt-2 glass-card rounded-xl p-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-[10px] font-bold">● STUDIO LIVE</span>
            </div>
            <div className="flex gap-3 text-[9px] text-white/30 flex-wrap">
              <span>UHD 4K Ready</span>
              <span>·</span>
              <span>320kbps Audio</span>
              <span>·</span>
              <span>10-Band EQ</span>
              <span>·</span>
              <span>AI DeNoise Active</span>
              <span>·</span>
              <span>30+ 3D/4D Backgrounds</span>
            </div>
            <div className="ml-auto text-[9px] text-white/20 hidden sm:block">
              dr.mirfan5577@gmail.com
            </div>
          </div>
        </main>

        {/* Public Info Sections */}
        <div className="px-2 pb-3 space-y-2 border-t border-white/5 pt-3">
          {/* About / Global Family / Vision banner */}
          <div className="glass-card rounded-xl p-3 flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-sm font-bold text-white pulse-glow">ES</div>
              <div>
                <p className="font-display text-[10px] font-bold text-purple-300">E.S wOrLd — EvEr-SmArT-wOrLd</p>
                <p className="text-[8px] text-white/30">A Global Family Platform for Creators Worldwide</p>
              </div>
            </div>
            <div className="flex gap-1.5 ml-auto flex-wrap">
              {[
                { label: 'ℹ️ About', key: 'public-info' as SidebarKey },
                { label: '🎨 Themes', key: 'theme-selector' as SidebarKey },
                { label: '⚙️ Cloud Sync', key: 'backend-settings' as SidebarKey },
              ].map(btn => (
                <button key={btn.label} onClick={() => setActiveSidebar(btn.key)}
                  className="text-[9px] btn-secondary text-white/70 px-2.5 py-1 rounded-lg">
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer strip */}
          <div className="glass-card rounded-xl p-2.5 flex items-start gap-2">
            <span className="text-yellow-400 text-sm flex-shrink-0">⚠️</span>
            <p className="text-white/30 text-[9px] leading-relaxed">
              <strong className="text-yellow-300/70">Disclaimer:</strong> This platform is for lawful personal and professional media creation only. Users are responsible for copyright compliance of all uploaded content. All intellectual property belongs to Dr M Irfan Qadir Thaheem. For full terms, visit the About & Info section.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-white/15 text-[9px]">
              © 2025 <span className="text-purple-400/60 font-display">Dr M Irfan Qadir Thaheem</span> — All Rights Reserved ·
              <span className="text-yellow-400/40"> E.S wOrLd / EvEr-SmArT-wOrLd</span> · The One Man Army
            </p>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="glass-panel border-t border-white/5 py-2 px-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-white/20 text-[9px]">
              <span className="font-display text-purple-400/60">E.S wOrLd</span>
              {' · '}EvEr-SmArT-wOrLd
              {' · '}By Dr M Irfan Qadir Thaheem — The One Man Army
              {' · '}All Rights Reserved © 2025
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSidebar('admin')}
                className="text-[9px] text-orange-400/70 hover:text-orange-300 transition-colors font-bold border border-orange-700/30 px-2 py-0.5 rounded-full hover:border-orange-500/50"
              >
                🔐 Admin Panel
              </button>
              <span className="text-white/15 text-[9px]">dr.mirfan5577@gmail.com</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== SIDEBAR ===== */}
      <Sidebar
        activeSidebar={activeSidebar}
        onClose={() => setActiveSidebar(null)}
        activeBackground={activeBackground}
        onSelectBackground={setActiveBackground}
        activeTheme={activeTheme}
        onSelectTheme={setActiveTheme}
      />

      {/* ===== AI SECRETARY ===== */}
      <AISecretary
        open={aiOpen}
        onOpen={() => setAiOpen(true)}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
};

export default StudioApp;
