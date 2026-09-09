import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

const KARAOKE_SONGS = [
  { title: 'My Way', artist: 'Frank Sinatra', genre: 'Classic' },
  { title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock' },
  { title: 'Shape of You', artist: 'Ed Sheeran', genre: 'Pop' },
  { title: 'Hotel California', artist: 'Eagles', genre: 'Rock' },
  { title: 'Billie Jean', artist: 'Michael Jackson', genre: 'Pop' },
  { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', genre: 'Jazz' },
];

const KaraokePanel: React.FC<Props> = ({ onClose }) => {
  const [activeGenre, setActiveGenre] = useState('All');
  const [pitchKey, setPitchKey] = useState(0);
  const [vocalLevel, setVocalLevel] = useState(20);
  const [bgLevel, setBgLevel] = useState(80);
  const [micLevel, setMicLevel] = useState(75);
  const [echo, setEcho] = useState(30);
  const [reverb, setReverb] = useState(40);
  const [isActive, setIsActive] = useState(false);

  const genres = ['All', 'Rock', 'Pop', 'Classic', 'Jazz'];
  const filtered = activeGenre === 'All' ? KARAOKE_SONGS : KARAOKE_SONGS.filter(s => s.genre === activeGenre);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-yellow-300 glow-text-gold">🎵 Karaoke Studio</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Karaoke Status */}
      <div className={`rounded-xl p-3 flex items-center gap-3 border ${isActive ? 'bg-yellow-900/30 border-yellow-600/50' : 'glass-card border-white/10'}`}>
        <div className="text-3xl">{isActive ? '🎤' : '🎵'}</div>
        <div className="flex-1">
          <p className={`text-sm font-bold ${isActive ? 'text-yellow-300' : 'text-white/60'}`}>
            {isActive ? 'Karaoke Mode Active' : 'Karaoke Mode Off'}
          </p>
          <p className="text-[10px] text-white/40">Vocal removal · Live mic · Lyrics display</p>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isActive ? 'bg-yellow-600/60 border border-yellow-500 text-yellow-200' : 'bg-white/10 border border-white/20 text-white hover:bg-yellow-900/30'}`}>
          {isActive ? '■ Stop' : '▶ Start'}
        </button>
      </div>

      {/* Genre Filter */}
      <div>
        <p className="text-cyan-300 text-xs font-bold mb-2">🎸 Genre</p>
        <div className="flex gap-1.5 flex-wrap">
          {genres.map(g => (
            <button key={g} onClick={() => setActiveGenre(g)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${activeGenre === g ? 'bg-yellow-700/40 border-yellow-500 text-yellow-300' : 'border-white/15 text-white/50 hover:border-white/30'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Songs List */}
      <div className="space-y-1.5">
        {filtered.map((song, i) => (
          <button key={i}
            className="w-full glass-card rounded-xl p-2.5 flex items-center gap-2 text-left hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-yellow-900/40 border border-yellow-700/30 flex items-center justify-center text-sm">🎤</div>
            <div className="flex-1">
              <p className="text-white text-xs font-medium">{song.title}</p>
              <p className="text-white/40 text-[10px]">{song.artist}</p>
            </div>
            <span className="text-[9px] bg-yellow-900/30 border border-yellow-700/20 text-yellow-400 px-1.5 py-0.5 rounded-full">{song.genre}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="glass-card rounded-xl p-3 space-y-3">
        <p className="text-purple-300 text-xs font-bold">🎛️ Karaoke Controls</p>

        {/* Pitch Key */}
        <div>
          <div className="flex justify-between text-[10px] text-white/60 mb-1">
            <span>Key / Pitch</span>
            <span className="text-yellow-300">{pitchKey > 0 ? '+' : ''}{pitchKey}</span>
          </div>
          <input type="range" min={-6} max={6} value={pitchKey}
            onChange={e => setPitchKey(Number(e.target.value))}
            className="w-full" style={{ accentColor: '#f59e0b' }} />
        </div>

        {[
          { label: 'Vocal Level', val: vocalLevel, set: setVocalLevel, color: '#ec4899' },
          { label: 'Background Music', val: bgLevel, set: setBgLevel, color: '#8b5cf6' },
          { label: 'Microphone', val: micLevel, set: setMicLevel, color: '#06b6d4' },
          { label: 'Echo', val: echo, set: setEcho, color: '#10b981' },
          { label: 'Reverb Hall', val: reverb, set: setReverb, color: '#f97316' },
        ].map(ctrl => (
          <div key={ctrl.label}>
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>{ctrl.label}</span>
              <span style={{ color: ctrl.color }}>{ctrl.val}%</span>
            </div>
            <input type="range" min={0} max={100} value={ctrl.val}
              onChange={e => ctrl.set(Number(e.target.value))}
              className="w-full" style={{ accentColor: ctrl.color }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KaraokePanel;
