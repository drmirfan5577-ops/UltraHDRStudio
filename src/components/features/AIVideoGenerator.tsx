import React, { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const VIDEO_STYLES = [
  { id: 'cinematic', label: 'Cinematic', icon: '🎬', color: '#ef4444', desc: 'Epic widescreen, dramatic color grading' },
  { id: 'futuristic', label: 'Futuristic', icon: '🚀', color: '#8b5cf6', desc: 'Neon, holographic, tech-noir aesthetic' },
  { id: 'minimalistic', label: 'Minimalistic', icon: '◻️', color: '#06b6d4', desc: 'Clean, sleek, whitespace-driven' },
  { id: 'editorial', label: 'Editorial', icon: '📰', color: '#f59e0b', desc: 'Magazine-style, editorial photography' },
  { id: 'retro', label: 'Retro Wave', icon: '🌅', color: '#ec4899', desc: 'Vintage 80s synth aesthetic' },
  { id: 'documentary', label: 'Documentary', icon: '📽️', color: '#10b981', desc: 'Raw, authentic, journalistic feel' },
];

const RESOLUTION_OPTIONS = ['720p HD', '1080p FHD', '4K UHD', '8K Ultra HDR'];
const DURATION_OPTIONS = ['15s Short', '30s Reel', '60s Story', '3m Standard', '5m Extended'];
const ASPECT_RATIOS = ['16:9 Landscape', '9:16 Vertical', '1:1 Square', '4:3 Classic', '21:9 Cinema'];

const SAMPLE_PROMPTS = [
  'A cinematic reveal of a futuristic city at sunset with glowing neon lights',
  'Ultra HDR close-up of musical instruments in a professional recording studio',
  'Abstract 3D audio visualizer with crystal-clear particles floating in deep space',
  'Dramatic rock concert stage with laser lights and crowd energy',
  'Peaceful jazz club atmosphere with warm amber lighting and saxophone solo',
];

interface GeneratedVideo {
  prompt: string;
  style: string;
  resolution: string;
  duration: string;
  ratio: string;
  previewColor: string;
}

const AIVideoGenerator: React.FC<Props> = ({ onClose }) => {
  const { state, simulateProcess } = useAudioEngine();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [resolution, setResolution] = useState('4K UHD');
  const [duration, setDuration] = useState('30s Reel');
  const [ratio, setRatio] = useState('16:9 Landscape');
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [exportFormat, setExportFormat] = useState('MP4');

  const activeStyle = VIDEO_STYLES.find(s => s.id === selectedStyle);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    simulateProcess('Generating AI Video...', () => {
      setGeneratedVideo({
        prompt: prompt.trim(),
        style: selectedStyle,
        resolution,
        duration,
        ratio,
        previewColor: activeStyle?.color || '#8b5cf6',
      });
    });
  };

  const handleExport = () => {
    simulateProcess(`Exporting as ${exportFormat}...`);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-violet-300 glow-text-purple">🤖 AI Video Generator</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="text-cyan-300 text-xs font-bold block mb-2">✍️ Describe Your Video</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. A dramatic cinematic shot of a professional recording studio with glowing equipment..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-violet-500/60 resize-none leading-relaxed"
        />
        {/* Sample prompts */}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {SAMPLE_PROMPTS.slice(0, 3).map((sp, i) => (
            <button key={i}
              onClick={() => setPrompt(sp)}
              className="text-[9px] text-violet-300/70 bg-violet-900/20 border border-violet-800/30 rounded-full px-2 py-0.5 hover:bg-violet-900/40 transition-colors truncate max-w-[160px]"
              title={sp}
            >
              💡 {sp.slice(0, 30)}...
            </button>
          ))}
        </div>
      </div>

      {/* Style Selector */}
      <div>
        <p className="text-yellow-300 text-xs font-bold mb-2">🎨 Video Style</p>
        <div className="grid grid-cols-2 gap-2">
          {VIDEO_STYLES.map(s => (
            <button key={s.id} onClick={() => setSelectedStyle(s.id)}
              className={`rounded-xl p-2.5 text-left border transition-all ${selectedStyle === s.id ? 'bg-white/10 scale-[1.02]' : 'border-white/8 bg-white/3 hover:bg-white/8'}`}
              style={{
                borderColor: selectedStyle === s.id ? s.color : undefined,
                boxShadow: selectedStyle === s.id ? `0 0 12px ${s.color}50` : undefined,
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs font-bold" style={{ color: selectedStyle === s.id ? s.color : 'rgba(255,255,255,0.7)' }}>{s.label}</span>
              </div>
              <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Row */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-green-400 text-xs font-bold mb-1.5">📐 Resolution</p>
          <div className="flex flex-wrap gap-1.5">
            {RESOLUTION_OPTIONS.map(r => (
              <button key={r} onClick={() => setResolution(r)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${resolution === r ? 'bg-green-700/40 border-green-500 text-green-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-orange-400 text-xs font-bold mb-1.5">⏱️ Duration</p>
          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTIONS.map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${duration === d ? 'bg-orange-700/40 border-orange-500 text-orange-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-pink-400 text-xs font-bold mb-1.5">📺 Aspect Ratio</p>
          <div className="flex flex-wrap gap-1.5">
            {ASPECT_RATIOS.map(a => (
              <button key={a} onClick={() => setRatio(a)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${ratio === a ? 'bg-pink-700/40 border-pink-500 text-pink-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      {state.processingState === 'idle' && (
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim()}
          className="btn-primary w-full text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🎬 Generate AI Video
        </button>
      )}

      {state.processingState === 'processing' && (
        <div className="glass-card rounded-xl p-3 space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>⚡ {state.processingLabel}</span>
            <span className="text-violet-300 font-bold">{state.progress}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full transition-all" style={{ width: `${state.progress}%` }} />
          </div>
          <div className="text-[10px] text-white/30 text-center">
            {state.progress < 30 ? '🧠 Analyzing prompt...' :
             state.progress < 60 ? '🎨 Applying style...' :
             state.progress < 85 ? '🎬 Rendering frames...' :
             '✨ Finalizing Ultra HDR output...'}
          </div>
        </div>
      )}

      {/* Generated Video Preview */}
      {generatedVideo && state.processingState !== 'processing' && (
        <div className="space-y-3">
          {/* Preview Screen */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              aspectRatio: '16/9',
              background: `radial-gradient(ellipse at 50% 50%, ${generatedVideo.previewColor}40, #050814)`,
              border: `1px solid ${generatedVideo.previewColor}50`,
              boxShadow: `0 0 30px ${generatedVideo.previewColor}30`,
            }}
          >
            {/* Animated video preview simulation */}
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
              <div className="text-5xl">
                {VIDEO_STYLES.find(s => s.id === generatedVideo.style)?.icon || '🎬'}
              </div>
              <div className="text-center px-4">
                <p className="text-white font-bold text-xs">{generatedVideo.resolution} · {generatedVideo.duration}</p>
                <p className="text-white/40 text-[9px] mt-1 italic leading-tight">"{generatedVideo.prompt.slice(0, 60)}{generatedVideo.prompt.length > 60 ? '...' : ''}"</p>
              </div>
            </div>
            {/* Scan lines effect */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
              }}
            />
            {/* Corner labels */}
            <div className="absolute top-2 left-2 bg-black/60 rounded-lg px-1.5 py-0.5 text-[8px] text-green-400 font-mono">
              ● AI Generated
            </div>
            <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-1.5 py-0.5 text-[8px] text-yellow-400 font-mono">
              Ultra HDR+
            </div>
            {/* Waveform at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end gap-0.5 px-2 pb-1 opacity-60">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-t-sm"
                  style={{
                    background: `hsl(${260 + i * 5}, 70%, 60%)`,
                    height: `${10 + Math.sin(i * 0.6) * 12 + Math.random() * 8}px`,
                    animation: `waveAnim ${0.5 + (i % 4) * 0.1}s ease-in-out infinite`,
                    animationDelay: `${i * 0.03}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="glass-card rounded-xl p-3">
            <p className="text-yellow-300 text-xs font-bold mb-2">📤 Export Generated Video</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['MP4', 'UHD 4K', 'MOV', 'MKV', 'WEBM'].map(f => (
                <button key={f} onClick={() => setExportFormat(f)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${exportFormat === f ? 'bg-yellow-700/40 border-yellow-500 text-yellow-300' : 'border-white/15 text-white/50'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={handleExport} className="w-full bg-gradient-to-r from-yellow-700/50 to-orange-700/50 border border-yellow-600/40 text-yellow-300 py-2 rounded-xl text-xs font-bold hover:from-yellow-600/60 hover:to-orange-600/60 transition-all">
              ⬇️ Export as {exportFormat}
            </button>
          </div>

          {/* Regenerate */}
          <button
            onClick={() => { setGeneratedVideo(null); handleGenerate(); }}
            className="w-full btn-secondary text-white py-2 rounded-xl text-xs font-bold"
          >
            🔄 Regenerate with Same Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default AIVideoGenerator;
