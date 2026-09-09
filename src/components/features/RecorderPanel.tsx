import React, { useState, useRef } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Props {
  onClose: () => void;
}

const RecorderPanel: React.FC<Props> = ({ onClose }) => {
  const { state, update, toggleRecord } = useAudioEngine();
  const [recTime, setRecTime] = useState(0);
  const [recordings, setRecordings] = useState<{ name: string; duration: string; size: string }[]>([
    { name: 'Studio_Take_01.wav', duration: '02:34', size: '12.4 MB' },
    { name: 'Vocal_Session_02.mp3', duration: '01:18', size: '3.1 MB' },
  ]);
  const timerRef = useRef<number | null>(null);

  const handleRecord = () => {
    if (!state.isRecording) {
      toggleRecord();
      timerRef.current = window.setInterval(() => setRecTime(t => t + 1), 1000);
    } else {
      toggleRecord();
      if (timerRef.current) clearInterval(timerRef.current);
      const mins = String(Math.floor(recTime / 60)).padStart(2, '0');
      const secs = String(recTime % 60).padStart(2, '0');
      setRecordings(prev => [
        { name: `Recording_${Date.now()}.wav`, duration: `${mins}:${secs}`, size: `${(recTime * 0.15).toFixed(1)} MB` },
        ...prev,
      ]);
      setRecTime(0);
    }
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-rose-300">⏺️ Studio Recorder</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Waveform Display */}
      <div className="bg-black/40 border border-rose-700/20 rounded-xl p-4 flex items-center justify-center gap-1.5 h-24">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="waveform-bar"
            style={{
              animationDelay: `${i * 0.05}s`,
              opacity: state.isRecording ? 1 : 0.3,
              background: state.isRecording
                ? 'linear-gradient(to top, #ef4444, #f97316)'
                : 'linear-gradient(to top, #7c3aed, #06b6d4)',
            }}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className={`font-display text-3xl font-bold ${state.isRecording ? 'text-red-400 glow-text-purple' : 'text-white/40'}`}>
          {formatTime(recTime)}
        </div>
        {state.isRecording && (
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold">RECORDING</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleRecord}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
            state.isRecording
              ? 'bg-red-600 border-2 border-red-400 glow-purple scale-110'
              : 'bg-white/10 border-2 border-white/20 hover:bg-red-900/40 hover:border-red-500'
          }`}
        >
          {state.isRecording ? '⏹️' : '⏺️'}
        </button>
      </div>

      {/* Input Settings */}
      <div className="glass-card rounded-xl p-3 space-y-3">
        <p className="text-cyan-300 text-xs font-bold">🎙️ Input Settings</p>
        {[
          { label: 'Mic Gain', def: 70, color: '#ef4444' },
          { label: 'Input Monitor', def: 50, color: '#f97316' },
          { label: 'Noise Gate', def: 30, color: '#06b6d4' },
        ].map(ctrl => {
          const [v, setV] = React.useState(ctrl.def);
          return (
            <div key={ctrl.label}>
              <div className="flex justify-between text-[10px] text-white/60 mb-1">
                <span>{ctrl.label}</span>
                <span style={{ color: ctrl.color }}>{v}%</span>
              </div>
              <input type="range" min={0} max={100} value={v}
                onChange={e => setV(Number(e.target.value))}
                className="w-full" style={{ accentColor: ctrl.color }} />
            </div>
          );
        })}
      </div>

      {/* Recordings List */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-semibold">📁 Recordings</p>
        {recordings.map((r, i) => (
          <div key={i} className="glass-card rounded-xl p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-900/40 border border-rose-700/30 flex items-center justify-center text-sm">🎵</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[10px] font-medium truncate">{r.name}</p>
              <p className="text-white/40 text-[9px]">{r.duration} · {r.size}</p>
            </div>
            <button className="text-cyan-400 text-[10px] hover:text-cyan-300">▶</button>
            <button className="text-white/30 text-[10px] hover:text-white/60">⬇</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecorderPanel;
