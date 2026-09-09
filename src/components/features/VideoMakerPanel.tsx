import React, { useState } from 'react';
import { ANIMATION_EFFECTS } from '@/constants/features';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const VIDEO_STYLES = ['Cinematic', 'Modern', 'Minimalistic', 'Editorial', 'Futuristic', 'Retro', 'Noir', 'Neon', 'Documentary', 'Vlog'];
const VIDEO_EFFECTS = ['Color Grade', 'LUT Filter', 'Slow Motion', 'Time Lapse', 'Bokeh', 'Lens Flare', 'Film Grain', 'Vignette', '4K Upscale', 'HDR'];

const VideoMakerPanel: React.FC<Props> = ({ onClose }) => {
  const { state, simulateProcess } = useAudioEngine();
  const [selectedStyle, setSelectedStyle] = useState('Cinematic');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [selectedAnims, setSelectedAnims] = useState<string[]>([]);
  const [resolution, setResolution] = useState('4K UHD');

  const toggleEffect = (e: string) =>
    setSelectedEffects(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  const toggleAnim = (a: string) =>
    setSelectedAnims(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-red-300">🎬 Video Maker Studio</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-red-700/40 rounded-xl p-4 text-center hover:border-red-500/60 transition-colors cursor-pointer bg-red-900/10">
        <div className="text-3xl mb-1">🎥</div>
        <p className="text-white/60 text-xs">Drop video files here or click to import</p>
        <p className="text-white/30 text-[10px] mt-1">MP4, MOV, AVI, MKV, WebM — All formats</p>
      </div>

      {/* Output Resolution */}
      <div>
        <p className="text-cyan-300 text-xs font-bold mb-2">📐 Output Resolution</p>
        <div className="flex flex-wrap gap-1.5">
          {['720p HD', '1080p FHD', '4K UHD', '8K Ultra', '4K 60fps', 'Custom'].map(r => (
            <button key={r} onClick={() => setResolution(r)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${resolution === r ? 'bg-red-700/40 border-red-500 text-red-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Video Style */}
      <div>
        <p className="text-yellow-300 text-xs font-bold mb-2">🎨 Video Style</p>
        <div className="flex flex-wrap gap-1.5">
          {VIDEO_STYLES.map(s => (
            <button key={s} onClick={() => setSelectedStyle(s)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${selectedStyle === s ? 'bg-yellow-700/40 border-yellow-500 text-yellow-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Video Effects */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-purple-300 text-xs font-bold mb-2">🌈 Video Effects</p>
        <div className="grid grid-cols-4 gap-1.5">
          {VIDEO_EFFECTS.map(e => (
            <button key={e} onClick={() => toggleEffect(e)}
              className={`text-[9px] py-1 rounded-lg border text-center transition-all ${selectedEffects.includes(e) ? 'bg-purple-700/40 border-purple-500 text-purple-300' : 'border-white/10 text-white/40 hover:text-white/70'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* 30+ Animations */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-green-400 text-xs font-bold mb-2">✨ 30+ Animation Effects</p>
        <div className="max-h-36 overflow-y-auto grid grid-cols-3 gap-1">
          {ANIMATION_EFFECTS.slice(0, 18).map(a => (
            <button key={a} onClick={() => toggleAnim(a)}
              className={`text-[9px] py-1 px-1 rounded-lg border text-center transition-all ${selectedAnims.includes(a) ? 'bg-green-700/30 border-green-500 text-green-300' : 'border-white/10 text-white/40 hover:text-white/60'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Ultra HDR Badge */}
      <div className="glass-panel-bright rounded-xl p-3 flex items-center gap-3">
        <div className="text-2xl">🎞️</div>
        <div>
          <p className="text-yellow-300 text-xs font-bold">Ultra HDR Plus — Enabled</p>
          <p className="text-white/50 text-[10px]">10-bit color depth · Dolby Vision · HDR10+</p>
        </div>
        <div className="ml-auto w-3 h-3 bg-yellow-400 rounded-full pulse-glow" />
      </div>

      {state.processingState === 'idle' && (
        <button onClick={() => simulateProcess('Rendering Ultra HDR Video...')}
          className="btn-primary w-full text-white py-2.5 rounded-xl font-bold text-sm">
          🎬 Render Video
        </button>
      )}
      {state.processingState === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>🎥 {state.processingLabel}</span>
            <span className="text-red-300">{state.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      )}
      {state.processingState === 'done' && (
        <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-center">
          <span className="text-green-400 font-bold text-sm">✅ Video Rendered Successfully!</span>
        </div>
      )}
    </div>
  );
};

export default VideoMakerPanel;
