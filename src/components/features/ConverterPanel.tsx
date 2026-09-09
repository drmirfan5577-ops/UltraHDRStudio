import React, { useState } from 'react';
import { OUTPUT_FORMATS, QUALITY_OPTIONS } from '@/constants/features';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const ConverterPanel: React.FC<Props> = ({ onClose }) => {
  const { state, update, simulateProcess } = useAudioEngine();
  const [inputFormat, setInputFormat] = useState('MP4');
  const [outputFormat, setOutputFormat] = useState('MP3');

  const audioFormats = OUTPUT_FORMATS.filter(f => f.type === 'audio');
  const videoFormats = OUTPUT_FORMATS.filter(f => f.type === 'video');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-emerald-300">🔄 Format Converter</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-emerald-700/40 rounded-xl p-4 text-center hover:border-emerald-500/60 transition-colors cursor-pointer bg-emerald-900/10">
        <div className="text-3xl mb-1">📂</div>
        <p className="text-white/60 text-xs">Upload file to convert</p>
        <p className="text-white/30 text-[10px] mt-1">All formats supported — Audio & Video</p>
      </div>

      {/* Conversion Flow */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-yellow-300 text-xs font-bold mb-3">⚡ Conversion Pipeline</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/5 border border-emerald-700/30 rounded-xl p-2 text-center">
            <p className="text-[9px] text-white/40">Input</p>
            <p className="text-emerald-300 font-bold text-sm">.{inputFormat}</p>
          </div>
          <div className="text-white/40 text-lg">→</div>
          <div className="flex-1 bg-white/5 border border-cyan-700/30 rounded-xl p-2 text-center">
            <p className="text-[9px] text-white/40">Output</p>
            <p className="text-cyan-300 font-bold text-sm">.{outputFormat}</p>
          </div>
        </div>
      </div>

      {/* Audio Output Formats */}
      <div>
        <p className="text-pink-300 text-xs font-bold mb-2">🎵 Audio Output Formats</p>
        <div className="flex flex-wrap gap-1.5">
          {audioFormats.map(f => (
            <button key={f.ext}
              onClick={() => { setOutputFormat(f.ext); update({ outputFormat: f.ext }); }}
              className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${outputFormat === f.ext ? 'bg-pink-700/40 border-pink-500 text-pink-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              .{f.ext}
            </button>
          ))}
        </div>
      </div>

      {/* Video Output Formats */}
      <div>
        <p className="text-blue-300 text-xs font-bold mb-2">🎬 Video Output Formats</p>
        <div className="flex flex-wrap gap-1.5">
          {videoFormats.map(f => (
            <button key={f.ext}
              onClick={() => { setOutputFormat(f.ext); update({ outputFormat: f.ext }); }}
              className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${outputFormat === f.ext ? 'bg-blue-700/40 border-blue-500 text-blue-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              .{f.ext}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-green-400 text-xs font-bold mb-2">📊 Sound Quality</p>
        <div className="flex flex-wrap gap-1.5">
          {QUALITY_OPTIONS.map(q => (
            <button key={q.value}
              onClick={() => update({ quality: q.value })}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${state.quality === q.value ? 'bg-green-700/40 border-green-500 text-green-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Convert Presets */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-orange-300 text-xs font-bold mb-2">⚡ Quick Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'MP4 → MP3', from: 'MP4', to: 'MP3' },
            { label: 'MP4 → UHD', from: 'MP4', to: 'UHD' },
            { label: 'WAV → FLAC', from: 'WAV', to: 'FLAC' },
            { label: 'MP3 → AAC', from: 'MP3', to: 'AAC' },
          ].map(preset => (
            <button key={preset.label}
              onClick={() => { setInputFormat(preset.from); setOutputFormat(preset.to); }}
              className="text-[10px] bg-white/5 border border-orange-700/20 rounded-lg py-1.5 text-orange-300 hover:bg-orange-900/20 transition-colors">
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {state.processingState === 'idle' && (
        <button onClick={() => simulateProcess(`Converting to .${outputFormat}...`)}
          className="btn-primary w-full text-white py-2.5 rounded-xl font-bold text-sm">
          🔄 Convert Now
        </button>
      )}
      {state.processingState === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>⚡ {state.processingLabel}</span>
            <span className="text-emerald-300">{state.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      )}
      {state.processingState === 'done' && (
        <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 flex items-center justify-between">
          <span className="text-green-400 font-bold text-sm">✅ Converted!</span>
          <button className="text-cyan-400 text-xs hover:text-cyan-300 flex items-center gap-1">
            ⬇️ Download .{outputFormat}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConverterPanel;
