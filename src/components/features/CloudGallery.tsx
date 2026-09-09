import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

interface SavedFile {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'image' | 'project';
  format: string;
  size: string;
  duration?: string;
  date: string;
  quality?: string;
  icon: string;
  color: string;
  thumbnail?: string;
}

const DEMO_FILES: SavedFile[] = [
  { id: '1', name: 'Studio Recording - Session 1', type: 'audio', format: 'FLAC', size: '24.3 MB', duration: '3:42', date: '2025-07-10', quality: '320kbps', icon: '🎵', color: '#8b5cf6' },
  { id: '2', name: 'Karaoke - Bohemian Rhapsody', type: 'audio', format: 'MP3', size: '8.1 MB', duration: '5:55', date: '2025-07-09', quality: '256kbps', icon: '🎤', color: '#ec4899' },
  { id: '3', name: 'Rock Concert Mix', type: 'audio', format: 'WAV', size: '87.2 MB', duration: '4:20', date: '2025-07-08', quality: 'Lossless', icon: '🎸', color: '#ef4444' },
  { id: '4', name: 'Ultra HDR Promo Video', type: 'video', format: 'MP4', size: '412 MB', duration: '1:30', date: '2025-07-07', quality: '4K UHD', icon: '🎬', color: '#f59e0b' },
  { id: '5', name: 'AI Generated - City Night', type: 'video', format: 'UHD', size: '1.2 GB', duration: '0:30', date: '2025-07-06', quality: '8K Ultra', icon: '🤖', color: '#06b6d4' },
  { id: '6', name: 'ES wOrLd Logo v2', type: 'image', format: 'PNG', size: '2.4 MB', date: '2025-07-05', icon: '🎨', color: '#d946ef' },
  { id: '7', name: 'Studio Header Banner', type: 'image', format: 'PNG', size: '1.8 MB', date: '2025-07-04', icon: '🖼️', color: '#84cc16' },
  { id: '8', name: 'Jazz Session - Evening', type: 'audio', format: 'AAC', size: '15.7 MB', duration: '6:12', date: '2025-07-03', quality: '192kbps', icon: '🎷', color: '#f97316' },
  { id: '9', name: 'Voice FX Pack - Robot', type: 'audio', format: 'WAV', size: '3.2 MB', duration: '0:45', date: '2025-07-02', quality: 'Lossless', icon: '🤖', color: '#14b8a6' },
  { id: '10', name: 'Music Studio Project', type: 'project', format: 'USP', size: '156 MB', date: '2025-07-01', icon: '🎛️', color: '#a855f7' },
];

type FilterType = 'all' | 'audio' | 'video' | 'image' | 'project';
type ViewMode = 'grid' | 'list';

const CloudGallery: React.FC<Props> = ({ onClose }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [storageUsed] = useState(68);

  const filtered = DEMO_FILES.filter(f => {
    if (filter !== 'all' && f.type !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setUploadProgress(null), 1500); }
      setUploadProgress(Math.min(100, Math.round(p)));
    }, 200);
  };

  const filterIcons: Record<FilterType, string> = { all: '📁', audio: '🎵', video: '🎬', image: '🖼️', project: '🎛️' };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-cyan-300 glow-text-cyan">☁️ Cloud Gallery</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Storage Bar */}
      <div className="glass-card rounded-xl p-3">
        <div className="flex justify-between text-[10px] text-white/60 mb-1.5">
          <span>☁️ Cloud Storage</span>
          <span className="text-cyan-300 font-bold">{storageUsed}% used</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${storageUsed}%`,
              background: storageUsed > 80 ? 'linear-gradient(90deg, #ef4444, #f97316)' : 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
              boxShadow: '0 0 6px rgba(6,182,212,0.5)',
            }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-white/30 mt-1">
          <span>6.8 GB used</span>
          <span>10 GB total</span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex gap-2">
        <button onClick={simulateUpload}
          className="flex-1 btn-primary text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
          ⬆️ Upload
        </button>
        <button
          className="flex-1 btn-secondary text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
          📁 New Folder
        </button>
        <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          className="w-10 h-9 btn-secondary text-white rounded-xl text-sm flex items-center justify-center">
          {view === 'grid' ? '☰' : '⊞'}
        </button>
      </div>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="glass-card rounded-xl p-3 space-y-1.5">
          <div className="flex justify-between text-[10px] text-white/60">
            <span>⬆️ Uploading to Cloud...</span>
            <span className="text-cyan-300 font-bold">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="meter-fill h-full" style={{ width: `${uploadProgress}%` }} />
          </div>
          {uploadProgress === 100 && <p className="text-green-400 text-[10px] text-center font-bold">✅ Upload Complete!</p>}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search files..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {(['all', 'audio', 'video', 'image', 'project'] as FilterType[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-1 rounded-lg text-[9px] font-bold transition-all capitalize ${filter === f ? 'bg-cyan-700/50 border border-cyan-500/60 text-cyan-300' : 'text-white/40 hover:text-white/70'}`}>
            {filterIcons[f]}
          </button>
        ))}
      </div>

      {/* Selected Actions */}
      {selectedFiles.length > 0 && (
        <div className="flex gap-2 items-center bg-purple-900/30 border border-purple-700/40 rounded-xl p-2">
          <span className="text-purple-300 text-[10px] flex-1">{selectedFiles.length} selected</span>
          <button className="text-[10px] text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded-lg border border-cyan-700/40">⬇️ Download</button>
          <button onClick={() => setSelectedFiles([])} className="text-[10px] text-red-300 bg-red-900/30 px-2 py-1 rounded-lg border border-red-700/40">🗑️ Delete</button>
        </div>
      )}

      {/* Files */}
      <div className={view === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
        {filtered.map(file => (
          <div
            key={file.id}
            onClick={() => toggleSelect(file.id)}
            className={`glass-card rounded-xl cursor-pointer transition-all ${selectedFiles.includes(file.id) ? 'border-cyan-500/60 bg-cyan-900/20' : ''}`}
          >
            {view === 'grid' ? (
              <div className="p-2.5">
                <div className="relative rounded-lg overflow-hidden mb-2 flex items-center justify-center"
                  style={{ height: 60, background: `radial-gradient(ellipse at center, ${file.color}30, transparent)` }}>
                  <span className="text-3xl">{file.icon}</span>
                  {selectedFiles.includes(file.id) && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">✓</div>
                  )}
                  {file.duration && (
                    <div className="absolute bottom-1 right-1 bg-black/70 text-[8px] text-white/80 rounded px-1">{file.duration}</div>
                  )}
                </div>
                <p className="text-white text-[10px] font-medium leading-tight truncate">{file.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] border rounded px-1 py-0.5" style={{ borderColor: file.color + '60', color: file.color }}>{file.format}</span>
                  <span className="text-[8px] text-white/30">{file.size}</span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `radial-gradient(circle, ${file.color}25, transparent)` }}>
                  {file.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{file.name}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[9px] text-white/30">{file.format} · {file.size}</span>
                    {file.duration && <span className="text-[9px] text-white/30">· {file.duration}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[8px] text-white/20">{file.date}</span>
                  {selectedFiles.includes(file.id) && <span className="text-cyan-400 text-xs">✓</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-white/25">
          <div className="text-4xl mb-2">☁️</div>
          <p className="text-xs">No files found</p>
        </div>
      )}
    </div>
  );
};

export default CloudGallery;
