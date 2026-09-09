import React, { useState } from 'react';
import { OUTPUT_FORMATS, QUALITY_OPTIONS } from '@/constants/features';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const ExportPanel: React.FC<Props> = ({ onClose }) => {
  const { state, update, simulateProcess } = useAudioEngine();
  const [metadata, setMetadata] = useState({ title: 'Ultra Studio Export', artist: '', album: '' });

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-orange-300">📤 Export Studio</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Export Summary */}
      <div className="glass-panel-bright rounded-xl p-3 space-y-2">
        <p className="text-yellow-300 text-xs font-bold">📋 Export Settings Summary</p>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-white/40">Format</p>
            <p className="text-orange-300 font-bold">.{state.outputFormat}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-white/40">Quality</p>
            <p className="text-green-300 font-bold">{state.quality} kbps</p>
          </div>
        </div>
      </div>

      {/* Output Format */}
      <div>
        <p className="text-cyan-300 text-xs font-bold mb-2">🎵 Audio Formats</p>
        <div className="flex flex-wrap gap-1.5">
          {OUTPUT_FORMATS.filter(f => f.type === 'audio').map(f => (
            <button key={f.ext}
              onClick={() => update({ outputFormat: f.ext })}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${state.outputFormat === f.ext ? 'bg-orange-700/40 border-orange-500 text-orange-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              .{f.ext}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-blue-300 text-xs font-bold mb-2">🎬 Video Formats</p>
        <div className="flex flex-wrap gap-1.5">
          {OUTPUT_FORMATS.filter(f => f.type === 'video').map(f => (
            <button key={f.ext}
              onClick={() => update({ outputFormat: f.ext })}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${state.outputFormat === f.ext ? 'bg-blue-700/40 border-blue-500 text-blue-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              .{f.ext}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div className="glass-card rounded-xl p-3">
        <p className="text-green-400 text-xs font-bold mb-2">📊 Output Quality</p>
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

      {/* Metadata */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-purple-300 text-xs font-bold">🏷️ File Metadata</p>
        {[
          { key: 'title', label: 'Title', placeholder: 'Track title...' },
          { key: 'artist', label: 'Artist', placeholder: 'Artist name...' },
          { key: 'album', label: 'Album', placeholder: 'Album name...' },
        ].map(field => (
          <div key={field.key}>
            <p className="text-[10px] text-white/40 mb-1">{field.label}</p>
            <input
              type="text"
              value={metadata[field.key as keyof typeof metadata]}
              onChange={e => setMetadata(prev => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-purple-500/50"
            />
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass-card rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-white/10">
          <input type="checkbox" defaultChecked className="accent-orange-500 w-3 h-3" />
          <span className="text-[10px] text-white/60">Normalize Audio</span>
        </div>
        <div className="glass-card rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-white/10">
          <input type="checkbox" defaultChecked className="accent-orange-500 w-3 h-3" />
          <span className="text-[10px] text-white/60">Add Metadata</span>
        </div>
        <div className="glass-card rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-white/10">
          <input type="checkbox" className="accent-orange-500 w-3 h-3" />
          <span className="text-[10px] text-white/60">Split Channels</span>
        </div>
        <div className="glass-card rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-white/10">
          <input type="checkbox" defaultChecked className="accent-orange-500 w-3 h-3" />
          <span className="text-[10px] text-white/60">Dithering</span>
        </div>
      </div>

      {state.processingState === 'idle' && (
        <button onClick={() => simulateProcess(`Exporting .${state.outputFormat}...`)}
          className="btn-primary w-full text-white py-3 rounded-xl font-bold text-sm">
          📤 Export Now
        </button>
      )}
      {state.processingState === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>⚡ {state.processingLabel}</span>
            <span className="text-orange-300">{state.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      )}
      {state.processingState === 'done' && (
        <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 flex items-center justify-between">
          <span className="text-green-400 font-bold text-sm">✅ Export Complete!</span>
          <button className="btn-secondary text-white text-xs px-3 py-1.5 rounded-lg">⬇️ Download</button>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
