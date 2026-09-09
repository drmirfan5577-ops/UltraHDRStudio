import React, { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const MediaPlayerPanel: React.FC<Props> = ({ onClose }) => {
  const { state, togglePlay } = useAudioEngine();
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(32);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const playlist = [
    { title: 'Studio Session 01', duration: '4:23', size: '14.2MB', active: true },
    { title: 'Vocal Take — Final', duration: '3:12', size: '8.7MB', active: false },
    { title: 'Background Mix v3', duration: '5:48', size: '22.1MB', active: false },
    { title: 'Karaoke Export', duration: '3:55', size: '11.4MB', active: false },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-teal-300">▶️ Media Player</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Now Playing */}
      <div className="glass-panel-bright rounded-2xl p-4 text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-3xl glow-cyan">🎵</div>
        <div>
          <p className="text-white font-bold text-sm">Studio Session 01</p>
          <p className="text-white/40 text-xs">Ultra Studio Project · WAV 320kbps</p>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <input type="range" min={0} max={100} value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            className="w-full" style={{ accentColor: '#14b8a6' }} />
          <div className="flex justify-between text-[10px] text-white/40">
            <span>1:24</span>
            <span>4:23</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setShuffle(!shuffle)}
            className={`text-lg transition-all ${shuffle ? 'text-teal-400' : 'text-white/30 hover:text-white/60'}`}>
            🔀
          </button>
          <button className="text-2xl text-white/60 hover:text-white transition-colors">⏮️</button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-xl hover:bg-teal-500 transition-colors glow-cyan">
            {state.isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="text-2xl text-white/60 hover:text-white transition-colors">⏭️</button>
          <button onClick={() => setRepeat(!repeat)}
            className={`text-lg transition-all ${repeat ? 'text-teal-400' : 'text-white/30 hover:text-white/60'}`}>
            🔁
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-sm">🔈</span>
          <input type="range" min={0} max={100} value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="flex-1" style={{ accentColor: '#14b8a6' }} />
          <span className="text-white/40 text-sm">🔊</span>
          <span className="text-teal-400 text-[10px] w-6">{volume}</span>
        </div>
      </div>

      {/* Playlist */}
      <div>
        <p className="text-white/50 text-xs font-semibold mb-2">📋 Playlist</p>
        <div className="space-y-1.5">
          {playlist.map((track, i) => (
            <div key={i}
              className={`glass-card rounded-xl p-2.5 flex items-center gap-2 cursor-pointer ${track.active ? 'border border-teal-500/40 bg-teal-900/20' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${track.active ? 'bg-teal-600/60' : 'bg-white/5'}`}>
                {track.active && state.isPlaying ? '▶' : '♪'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-medium truncate ${track.active ? 'text-teal-300' : 'text-white/70'}`}>{track.title}</p>
                <p className="text-[9px] text-white/30">{track.duration} · {track.size}</p>
              </div>
              <button className="text-white/20 hover:text-white/60 text-xs">⋯</button>
            </div>
          ))}
        </div>
      </div>

      {/* Import */}
      <div className="border-dashed border border-teal-700/30 rounded-xl p-3 text-center cursor-pointer hover:border-teal-500/50 transition-colors">
        <p className="text-white/40 text-xs">+ Import Media Files</p>
        <p className="text-white/20 text-[10px] mt-0.5">All audio & video formats</p>
      </div>
    </div>
  );
};

export default MediaPlayerPanel;
