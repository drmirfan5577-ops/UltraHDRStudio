import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onClose: () => void;
}

interface LyricLine {
  time: number;
  text: string;
  translation?: string;
}

const SAMPLE_LYRICS: Record<string, LyricLine[]> = {
  bohemian: [
    { time: 0, text: 'Is this the real life?', translation: 'کیا یہ حقیقی زندگی ہے؟' },
    { time: 3, text: 'Is this just fantasy?', translation: 'یا صرف ایک خیال ہے؟' },
    { time: 6, text: 'Caught in a landslide,', translation: 'زمین کھسکاؤ میں پھنسا ہوا' },
    { time: 9, text: 'No escape from reality.', translation: 'حقیقت سے کوئی فرار نہیں' },
    { time: 13, text: 'Open your eyes,', translation: 'آنکھیں کھول' },
    { time: 15, text: 'Look up to the skies and see,', translation: 'آسمان کی طرف دیکھ' },
    { time: 19, text: 'I\'m just a poor boy,', translation: 'میں ایک غریب لڑکا ہوں' },
    { time: 22, text: 'I need no sympathy,', translation: 'مجھے ہمدردی کی ضرورت نہیں' },
    { time: 26, text: 'Because it\'s easy come, easy go,', translation: 'کیونکہ آسانی سے آتا ہے، آسانی سے جاتا ہے' },
    { time: 30, text: 'A little high, little low,', translation: 'تھوڑا اونچا، تھوڑا نیچا' },
    { time: 34, text: 'Anyway the wind blows,', translation: 'ہوا جس طرف بھی چلے' },
    { time: 38, text: 'Doesn\'t really matter to me, to me.', translation: 'مجھے کوئی فرق نہیں پڑتا' },
  ],
  mywaysinatra: [
    { time: 0, text: 'And now, the end is near;', translation: 'اور اب، انجام قریب ہے' },
    { time: 4, text: 'And so I face the final curtain.', translation: 'اور میں آخری پردے کا سامنا کرتا ہوں' },
    { time: 9, text: 'My friend, I\'ll say it clear,', translation: 'میرے دوست، میں واضح کہوں گا' },
    { time: 13, text: 'I\'ll state my case, of which I\'m certain.', translation: 'میں اپنا موقف بیان کروں گا' },
    { time: 18, text: 'I\'ve lived a life that\'s full.', translation: 'میں نے بھرپور زندگی گزاری' },
    { time: 22, text: 'I\'ve traveled each and every highway;', translation: 'میں نے ہر شاہراہ طے کی' },
    { time: 27, text: 'But more, much more than this,', translation: 'لیکن اس سے بھی زیادہ' },
    { time: 31, text: 'I did it my way.', translation: 'میں نے اپنے انداز میں کیا' },
  ],
  jazz: [
    { time: 0, text: 'Fly me to the moon', translation: 'مجھے چاند پر لے جاؤ' },
    { time: 4, text: 'Let me play among the stars', translation: 'مجھے ستاروں میں کھیلنے دو' },
    { time: 8, text: 'Let me see what spring is like', translation: 'مجھے دیکھنے دو بہار کیسی ہے' },
    { time: 12, text: 'On a Jupiter and Mars', translation: 'مشتری اور مریخ پر' },
    { time: 17, text: 'In other words, hold my hand!', translation: 'دوسرے لفظوں میں، میرا ہاتھ تھامو' },
    { time: 21, text: 'In other words, baby kiss me!', translation: 'دوسرے لفظوں میں، مجھے چوم لو' },
  ],
};

const SONG_OPTIONS = [
  { id: 'bohemian', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock' },
  { id: 'mywaysinatra', title: 'My Way', artist: 'Frank Sinatra', genre: 'Classic' },
  { id: 'jazz', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', genre: 'Jazz' },
];

const LyricsPanel: React.FC<Props> = ({ onClose }) => {
  const [selectedSong, setSelectedSong] = useState('bohemian');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [colorTheme, setColorTheme] = useState<'purple' | 'cyan' | 'gold'>('cyan');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const lyrics = SAMPLE_LYRICS[selectedSong] || [];
  const maxTime = lyrics[lyrics.length - 1]?.time + 4 || 40;

  const getActiveIndex = () => {
    let active = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) active = i;
    }
    return active;
  };

  const activeIndex = getActiveIndex();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= maxTime) { setIsPlaying(false); return 0; }
          return t + 0.2;
        });
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, maxTime]);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeIndex]);

  const themeColors = {
    purple: { active: '#c084fc', glow: 'rgba(168,85,247,0.8)', dim: '#7c3aed' },
    cyan: { active: '#67e8f9', glow: 'rgba(6,182,212,0.8)', dim: '#0891b2' },
    gold: { active: '#fcd34d', glow: 'rgba(245,158,11,0.8)', dim: '#b45309' },
  };
  const theme = themeColors[colorTheme];

  const fontSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  const progress = maxTime > 0 ? (currentTime / maxTime) * 100 : 0;

  return (
    <div className="p-4 space-y-4 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-cyan-300 glow-text-cyan">🎤 Live Lyrics</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Song Selector */}
      <div>
        <p className="text-white/50 text-[10px] mb-1.5">Select Track</p>
        <div className="space-y-1.5">
          {SONG_OPTIONS.map(s => (
            <button key={s.id}
              onClick={() => { setSelectedSong(s.id); setCurrentTime(0); setIsPlaying(false); }}
              className={`w-full glass-card rounded-xl p-2.5 flex items-center gap-2 text-left transition-all ${selectedSong === s.id ? 'border-cyan-500/50 bg-cyan-900/20' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-700 to-purple-700 flex items-center justify-center text-sm flex-shrink-0">
                🎵
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-medium">{s.title}</p>
                <p className="text-white/40 text-[9px]">{s.artist} · {s.genre}</p>
              </div>
              {selectedSong === s.id && <span className="text-cyan-400 text-xs">▶</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-2">
        <button onClick={() => { setCurrentTime(0); setIsPlaying(false); }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 text-sm transition-all">
          ⏮
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all"
          style={{ background: `linear-gradient(135deg, ${theme.dim}, ${theme.active}40)`, border: `1px solid ${theme.active}60`, boxShadow: `0 0 15px ${theme.glow}` }}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={() => setCurrentTime(0)}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 text-sm transition-all">
          ⏹
        </button>
        <div className="flex-1">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              setCurrentTime(pct * maxTime);
            }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${theme.dim}, ${theme.active})`, boxShadow: `0 0 6px ${theme.glow}` }} />
          </div>
          <div className="flex justify-between text-[8px] text-white/25 mt-0.5">
            <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
            <span>{Math.floor(maxTime / 60)}:{String(Math.floor(maxTime % 60)).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Options Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1">
          {(['sm', 'md', 'lg'] as const).map(sz => (
            <button key={sz} onClick={() => setFontSize(sz)}
              className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center transition-all ${fontSize === sz ? 'bg-white/20 border-white/40 text-white' : 'border-white/10 text-white/40'}`}>
              {sz === 'sm' ? 'A' : sz === 'md' ? 'A' : 'A'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowTranslation(!showTranslation)}
          className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${showTranslation ? 'bg-yellow-700/30 border-yellow-500/60 text-yellow-300' : 'border-white/15 text-white/40'}`}>
          🌐 اردو
        </button>
        <div className="flex gap-1">
          {(['purple', 'cyan', 'gold'] as const).map(c => (
            <button key={c} onClick={() => setColorTheme(c)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${colorTheme === c ? 'scale-125' : 'opacity-60'}`}
              style={{ background: themeColors[c].active, borderColor: colorTheme === c ? 'white' : 'transparent' }} />
          ))}
        </div>
      </div>

      {/* Lyrics Display */}
      <div
        className="flex-1 overflow-y-auto space-y-1 rounded-xl glass-card p-3"
        style={{ minHeight: 200, maxHeight: 300 }}
      >
        {lyrics.map((line, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div
              key={i}
              ref={isActive ? activeLineRef : undefined}
              className={`transition-all duration-300 py-1.5 px-2 rounded-lg cursor-pointer ${isActive ? 'bg-white/8 rounded-xl' : 'hover:bg-white/5'}`}
              onClick={() => setCurrentTime(line.time)}
            >
              <p
                className={`${fontSizes[fontSize]} font-medium transition-all leading-relaxed`}
                style={{
                  color: isActive ? theme.active : isPast ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)',
                  textShadow: isActive ? `0 0 20px ${theme.glow}, 0 0 40px ${theme.glow}` : 'none',
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  transformOrigin: 'left center',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {isActive && <span className="mr-1.5" style={{ color: theme.active }}>♪</span>}
                {line.text}
              </p>
              {showTranslation && line.translation && (
                <p
                  className="text-[10px] mt-0.5 leading-relaxed"
                  dir="rtl"
                  style={{ color: isActive ? `${theme.active}90` : 'rgba(255,255,255,0.20)' }}
                >
                  {line.translation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Lyrics Upload */}
      <div className="border border-dashed border-white/15 rounded-xl p-3 text-center hover:border-white/30 transition-colors cursor-pointer">
        <p className="text-white/40 text-[10px]">📄 Upload custom .lrc/.txt lyrics file</p>
      </div>
    </div>
  );
};

export default LyricsPanel;
