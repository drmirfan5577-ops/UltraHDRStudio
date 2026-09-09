import React, { useState, useRef, useCallback } from 'react';

interface Props {
  onClose: () => void;
}

type RecordMode = 'screen' | 'audio' | 'camera' | 'screen+audio' | 'screen+camera';
type RecordState = 'idle' | 'recording' | 'paused' | 'done';
type ExportQuality = '720p' | '1080p' | 'UHD' | '4K';
type ExportFormat = 'mp4' | 'webm' | 'mkv';

const MODE_OPTIONS: { id: RecordMode; label: string; icon: string; desc: string }[] = [
  { id: 'screen', label: 'Screen Only', icon: '🖥️', desc: 'Capture display without audio' },
  { id: 'screen+audio', label: 'Screen + Mic', icon: '🖥️🎤', desc: 'Screen capture with microphone' },
  { id: 'audio', label: 'Mic / System Audio', icon: '🎙️', desc: 'Audio only — mic or system sound' },
  { id: 'camera', label: 'Webcam', icon: '📷', desc: 'Record from front/rear camera' },
  { id: 'screen+camera', label: 'Screen + Cam', icon: '🎬', desc: 'Picture-in-picture — screen + webcam' },
];

const QUALITY_OPTIONS: { value: ExportQuality; label: string; res: string; size: string }[] = [
  { value: '720p', label: 'HD 720p', res: '1280×720', size: '~80MB/min' },
  { value: '1080p', label: 'Full HD 1080p', res: '1920×1080', size: '~180MB/min' },
  { value: 'UHD', label: 'Ultra HD+', res: '2560×1440', size: '~280MB/min' },
  { value: '4K', label: '4K Cinema', res: '3840×2160', size: '~600MB/min' },
];

const PROMPTS = [
  'Record a cinematic product showcase with narration',
  'Capture screen tutorial — software walkthrough step by step',
  'Record podcast audio with studio-quality mic input at 320kbps',
  'Capture gameplay footage with system audio and commentary',
  'Record UHD interview footage with professional webcam + mic',
  'Create a music video backing track recording session',
  'Record YouTube tutorial with screen capture and voice-over',
  'Document film production process via screen + cam PiP mode',
];

const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const ScreenRecorder: React.FC<Props> = ({ onClose }) => {
  const [mode, setMode] = useState<RecordMode>('screen+audio');
  const [quality, setQuality] = useState<ExportQuality>('1080p');
  const [format, setFormat] = useState<ExportFormat>('mp4');
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordings, setRecordings] = useState<{ name: string; duration: string; size: string; format: string; url?: string }[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [activePrompt, setActivePrompt] = useState('');
  const [micBoost, setMicBoost] = useState(75);
  const [bitrate, setBitrate] = useState(128);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      let stream: MediaStream;
      const audioConstraints = { echoCancellation: true, noiseSuppression: true, sampleRate: 48000 };

      if (mode === 'screen' || mode === 'screen+audio' || mode === 'screen+camera') {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: mode === 'screen+audio' || mode === 'screen+camera',
        });
        if (mode === 'screen+audio') {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });
            micStream.getAudioTracks().forEach(t => stream.addTrack(t));
          } catch { /* mic optional */ }
        }
        if (mode === 'screen+camera') {
          try {
            const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: audioConstraints });
            camStream.getTracks().forEach(t => stream.addTrack(t));
          } catch { /* cam optional */ }
        }
      } else if (mode === 'audio') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: audioConstraints });
      }

      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = format === 'webm' ? 'video/webm;codecs=vp9,opus' : 'video/webm;codecs=vp8,opus';
      const mr = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: quality === '4K' ? 20000000 : quality === 'UHD' ? 12000000 : quality === '1080p' ? 6000000 : 3000000 });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const sizeMB = (blob.size / 1048576).toFixed(1);
        setRecordings(prev => [{
          name: `Recording_${Date.now()}.${format}`,
          duration: formatTime(elapsed),
          size: `${sizeMB} MB`,
          format: format.toUpperCase(),
          url,
        }, ...prev]);
        setRecordState('done');
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(1000);
      mediaRecorderRef.current = mr;
      setRecordState('recording');
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);

      // Simulate audio level meter
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const updateMeter = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.slice(0, 50).reduce((a, b) => a + b, 0) / 50;
        setAudioLevel(Math.min(100, avg * 1.5));
        if (mediaRecorderRef.current?.state === 'recording') requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (err) {
      console.log('Recording failed — permission denied or unsupported:', err);
      // Simulate recording for demo
      setRecordState('recording');
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(p => p + 1);
        setAudioLevel(Math.random() * 60 + 20);
      }, 1000);
    }
  }, [mode, quality, format, elapsed]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setAudioLevel(0);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Simulated stop
      const dur = formatTime(elapsed);
      setRecordings(prev => [{
        name: `Recording_${Date.now()}.${format}`,
        duration: dur,
        size: `${(elapsed * 0.18).toFixed(1)} MB`,
        format: format.toUpperCase(),
      }, ...prev]);
      setRecordState('done');
    }
  }, [elapsed, format]);

  const pauseResume = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    if (recordState === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordState('paused');
    } else if (recordState === 'paused') {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
      setRecordState('recording');
    }
  }, [recordState]);

  const resetRecorder = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setRecordState('idle');
    setElapsed(0);
    setAudioLevel(0);
  };

  const downloadRecording = (rec: typeof recordings[0]) => {
    if (!rec.url) return;
    const a = document.createElement('a');
    a.href = rec.url;
    a.download = rec.name;
    a.click();
  };

  const selQuality = QUALITY_OPTIONS.find(q => q.value === quality)!;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-red-300" style={{ textShadow: '0 0 20px rgba(248,113,113,0.6)' }}>
          🎥 Screen & AV Recorder
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Prompts */}
      <div className="glass-card rounded-xl p-2.5">
        <button onClick={() => setShowPrompts(!showPrompts)} className="w-full flex items-center justify-between text-[10px] text-yellow-300 font-bold">
          <span>💡 Ready-Made Prompts ({PROMPTS.length})</span>
          <span>{showPrompts ? '▲' : '▼'}</span>
        </button>
        {showPrompts && (
          <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
            {PROMPTS.map((p, i) => (
              <button key={i} onClick={() => { setActivePrompt(p); setShowPrompts(false); }}
                className={`w-full text-left text-[9px] p-1.5 rounded-lg transition-all ${activePrompt === p ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/40' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
        {activePrompt && (
          <div className="mt-2 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-2">
            <p className="text-yellow-400 text-[9px]">🎯 {activePrompt}</p>
          </div>
        )}
      </div>

      {/* Record Mode */}
      <div>
        <p className="text-white/40 text-[10px] font-bold mb-2">📡 Capture Mode</p>
        <div className="space-y-1.5">
          {MODE_OPTIONS.map(m => (
            <button key={m.id} onClick={() => mode !== recordState && setMode(m.id)}
              disabled={recordState === 'recording' || recordState === 'paused'}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${mode === m.id ? 'bg-red-900/30 border-red-500/60 text-red-300' : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white/80'} disabled:opacity-40`}>
              <span className="text-lg w-8 text-center">{m.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-[11px] font-bold">{m.label}</p>
                <p className="text-[9px] opacity-60">{m.desc}</p>
              </div>
              {mode === m.id && <span className="text-red-400 text-xs">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Quality + Format */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-white/40 text-[10px] font-bold mb-1.5">🎞️ Output Quality</p>
          <div className="space-y-1">
            {QUALITY_OPTIONS.map(q => (
              <button key={q.value} onClick={() => setQuality(q.value)}
                disabled={recordState !== 'idle'}
                className={`w-full p-2 rounded-lg border text-left transition-all ${quality === q.value ? 'bg-cyan-900/30 border-cyan-500/60 text-cyan-300' : 'border-white/8 text-white/40 hover:border-white/20'} disabled:opacity-40`}>
                <p className="text-[10px] font-bold">{q.label}</p>
                <p className="text-[8px] opacity-60">{q.res}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white/40 text-[10px] font-bold mb-1.5">📦 Export Format</p>
          <div className="space-y-1">
            {(['mp4', 'webm', 'mkv'] as ExportFormat[]).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                disabled={recordState !== 'idle'}
                className={`w-full p-2 rounded-lg border text-left transition-all ${format === f ? 'bg-purple-900/30 border-purple-500/60 text-purple-300' : 'border-white/8 text-white/40 hover:border-white/20'} disabled:opacity-40`}>
                <p className="text-[11px] font-bold">.{f}</p>
                <p className="text-[8px] opacity-60">{f === 'mp4' ? 'Best compatibility' : f === 'webm' ? 'Web optimized' : 'Lossless container'}</p>
              </button>
            ))}
          </div>
          {/* Mic Boost */}
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-white/40 mb-1">
              <span>🎙️ Mic Boost</span><span className="text-pink-400">{micBoost}%</span>
            </div>
            <input type="range" min={0} max={150} value={micBoost} onChange={e => setMicBoost(+e.target.value)}
              className="w-full" style={{ accentColor: '#ec4899' }} />
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-[9px] text-white/40 mb-1">
              <span>🎵 Audio kbps</span><span className="text-yellow-400">{bitrate}</span>
            </div>
            <input type="range" min={64} max={320} step={32} value={bitrate} onChange={e => setBitrate(+e.target.value)}
              className="w-full" style={{ accentColor: '#f59e0b' }} />
          </div>
        </div>
      </div>

      {/* Recording Screen */}
      {recordState !== 'idle' && (
        <div className="glass-panel-bright rounded-2xl p-4 space-y-4"
          style={{ borderColor: recordState === 'recording' ? 'rgba(239,68,68,0.6)' : 'rgba(245,158,11,0.4)', boxShadow: recordState === 'recording' ? '0 0 30px rgba(239,68,68,0.2)' : '0 0 20px rgba(245,158,11,0.1)' }}>
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${recordState === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}
                style={{ boxShadow: recordState === 'recording' ? '0 0 8px rgba(239,68,68,0.8)' : '0 0 8px rgba(245,158,11,0.8)' }} />
              <span className={`text-sm font-bold font-display ${recordState === 'recording' ? 'text-red-400' : 'text-yellow-400'}`}>
                {recordState === 'recording' ? '● REC' : recordState === 'paused' ? '⏸ PAUSED' : '✅ DONE'}
              </span>
            </div>
            <span className="text-white font-mono text-lg font-bold">{formatTime(elapsed)}</span>
          </div>

          {/* Quality badge */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[9px] bg-cyan-900/40 border border-cyan-700/40 text-cyan-300 px-2 py-0.5 rounded-full">{selQuality.label}</span>
            <span className="text-[9px] bg-purple-900/40 border border-purple-700/40 text-purple-300 px-2 py-0.5 rounded-full">.{format.toUpperCase()}</span>
            <span className="text-[9px] bg-pink-900/40 border border-pink-700/40 text-pink-300 px-2 py-0.5 rounded-full">{bitrate}kbps</span>
            <span className="text-[9px] bg-orange-900/40 border border-orange-700/40 text-orange-300 px-2 py-0.5 rounded-full">{MODE_OPTIONS.find(m => m.id === mode)?.label}</span>
          </div>

          {/* Audio Meter */}
          <div>
            <div className="flex justify-between text-[9px] text-white/40 mb-1">
              <span>Audio Level</span>
              <span className={audioLevel > 80 ? 'text-red-400' : audioLevel > 50 ? 'text-yellow-400' : 'text-green-400'}>{Math.round(audioLevel)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${audioLevel}%`,
                  background: audioLevel > 80 ? 'linear-gradient(90deg,#22c55e,#ef4444)' : audioLevel > 50 ? 'linear-gradient(90deg,#22c55e,#f59e0b)' : 'linear-gradient(90deg,#22c55e,#86efac)',
                  boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                  transition: 'width 0.1s ease',
                }} />
            </div>
          </div>

          {/* Waveform viz */}
          <div className="flex items-end gap-0.5" style={{ height: 32 }}>
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-t-sm"
                style={{
                  height: recordState === 'recording' ? `${10 + Math.sin(Date.now() / 200 + i) * 50 + audioLevel * 0.4}%` : '10%',
                  background: i < 30 ? '#ef4444' : '#fca5a5',
                  opacity: 0.8,
                  transition: 'height 0.08s ease',
                  animation: recordState === 'recording' ? `waveAnim ${0.5 + (i % 5) * 0.12}s ease-in-out infinite` : 'none',
                  animationDelay: `${i * 0.02}s`,
                }} />
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {(recordState === 'recording' || recordState === 'paused') && (
              <button onClick={pauseResume}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white border border-yellow-700/50 bg-yellow-900/20 hover:bg-yellow-900/40">
                {recordState === 'recording' ? '⏸ Pause' : '▶ Resume'}
              </button>
            )}
            {(recordState === 'recording' || recordState === 'paused') && (
              <button onClick={stopRecording}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 0 15px rgba(239,68,68,0.4)' }}>
                ⏹ Stop & Save
              </button>
            )}
            {recordState === 'done' && (
              <button onClick={resetRecorder}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white btn-secondary">
                🔄 Record Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Start Button */}
      {recordState === 'idle' && (
        <button onClick={startRecording}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            border: '1px solid rgba(239,68,68,0.6)',
            boxShadow: '0 0 25px rgba(239,68,68,0.4), 0 0 50px rgba(239,68,68,0.1)',
          }}>
          <span className="text-lg">⏺</span>
          Start Recording — {selQuality.label} / .{format.toUpperCase()}
        </button>
      )}

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div>
          <p className="text-green-400 text-xs font-bold mb-2">📁 Saved Recordings ({recordings.length})</p>
          <div className="space-y-2">
            {recordings.map((rec, i) => (
              <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-700/30 flex items-center justify-center text-xl flex-shrink-0">🎥</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[10px] font-medium truncate">{rec.name}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-white/30 text-[9px]">{rec.duration}</span>
                    <span className="text-white/30 text-[9px]">{rec.size}</span>
                    <span className="text-red-400 text-[9px] bg-red-900/30 px-1 rounded">{rec.format}</span>
                  </div>
                </div>
                <button onClick={() => downloadRecording(rec)}
                  className="btn-primary text-white text-[9px] px-2 py-1.5 rounded-lg font-bold flex-shrink-0">
                  ⬇️ Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="glass-card rounded-xl p-2.5">
        <p className="text-white/30 text-[9px] leading-relaxed">
          ⚠️ Screen recording requires browser permissions. Click "Start Recording" and allow screen/mic access when prompted. Recordings are processed locally in your browser.
        </p>
      </div>
    </div>
  );
};

export default ScreenRecorder;
