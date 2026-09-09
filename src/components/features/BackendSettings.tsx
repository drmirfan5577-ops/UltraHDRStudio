import React, { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

interface SyncLog {
  id: string;
  action: string;
  time: string;
  status: 'success' | 'pending' | 'error';
}

const INITIAL_LOGS: SyncLog[] = [
  { id: '1', action: 'Auto-saved project state', time: '2 min ago', status: 'success' },
  { id: '2', action: 'Synced audio export to cloud', time: '8 min ago', status: 'success' },
  { id: '3', action: 'Uploaded Studio Session 01', time: '1 hr ago', status: 'success' },
  { id: '4', action: 'Backup checkpoint created', time: '3 hrs ago', status: 'success' },
];

const BackendSettings: React.FC<Props> = ({ onClose }) => {
  const [cloudSync, setCloudSync] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5);
  const [maxBackups, setMaxBackups] = useState(10);
  const [quality, setQuality] = useState('320kbps');
  const [outputFormat, setOutputFormat] = useState('FLAC');
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_LOGS);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done'>('idle');
  const [backupProgress, setBackupProgress] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState('2 min ago');
  const [storageUsed] = useState(68);

  const triggerSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('done');
      setLastSync('just now');
      setSyncLogs(prev => [{
        id: String(Date.now()), action: 'Manual cloud sync completed', time: 'just now', status: 'success'
      }, ...prev.slice(0, 7)]);
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 2500);
  };

  const createBackup = () => {
    setBackupProgress(0);
    const iv = setInterval(() => {
      setBackupProgress(p => {
        if (p === null || p >= 100) { clearInterval(iv); return 100; }
        return Math.min(100, p + Math.random() * 20 + 5);
      });
    }, 250);
    setTimeout(() => {
      setSyncLogs(prev => [{
        id: String(Date.now()), action: `Full backup created (v${new Date().toISOString().slice(0, 10)})`, time: 'just now', status: 'success'
      }, ...prev.slice(0, 7)]);
      setTimeout(() => setBackupProgress(null), 1500);
    }, 3000);
  };

  // Live "last sync" timer simulation
  useEffect(() => {
    if (!cloudSync) return;
    const iv = setInterval(() => {
      // Just pulse the sync state silently
    }, syncInterval * 60 * 1000);
    return () => clearInterval(iv);
  }, [cloudSync, syncInterval]);

  const Toggle: React.FC<{ val: boolean; onChange: (v: boolean) => void; color?: string }> = ({ val, onChange, color = '#7c3aed' }) => (
    <button onClick={() => onChange(!val)}
      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
      style={{ background: val ? color : 'rgba(255,255,255,0.15)' }}>
      <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
        style={{ left: val ? 22 : 2 }} />
    </button>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-cyan-300 glow-text-cyan">☁️ Cloud Sync & Settings</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Sync Status Card */}
      <div className="glass-panel-bright rounded-xl p-3"
        style={{ borderColor: cloudSync ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.1)', boxShadow: cloudSync ? '0 0 20px rgba(6,182,212,0.15)' : 'none' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: cloudSync ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)' }}>
            {syncStatus === 'syncing' ? '🔄' : syncStatus === 'done' ? '✅' : cloudSync ? '☁️' : '☁️'}
          </div>
          <div className="flex-1">
            <p className="text-cyan-300 text-xs font-bold">
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'done' ? 'Sync Complete' : cloudSync ? 'Cloud Sync Active' : 'Cloud Sync Disabled'}
            </p>
            <p className="text-white/30 text-[10px]">Last sync: {lastSync}</p>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${cloudSync ? 'bg-green-400' : 'bg-white/20'}`}
            style={{ animation: cloudSync && syncStatus === 'syncing' ? 'pulse 1s infinite' : 'none' }} />
        </div>
        <div className="flex gap-2">
          <button onClick={triggerSync} disabled={!cloudSync || syncStatus === 'syncing'}
            className="flex-1 btn-primary text-white py-1.5 rounded-lg text-xs font-bold disabled:opacity-40">
            {syncStatus === 'syncing' ? '🔄 Syncing...' : '⬆️ Sync Now'}
          </button>
          <button onClick={createBackup}
            className="flex-1 btn-secondary text-white py-1.5 rounded-lg text-xs font-bold">
            📦 Backup
          </button>
        </div>
        {backupProgress !== null && (
          <div className="mt-2 space-y-1">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full meter-fill transition-all" style={{ width: `${Math.round(backupProgress)}%` }} />
            </div>
            <p className="text-[9px] text-center text-white/40">
              {Math.round(backupProgress) >= 100 ? '✅ Backup created!' : `Creating backup... ${Math.round(backupProgress)}%`}
            </p>
          </div>
        )}
      </div>

      {/* Storage Bar */}
      <div className="glass-card rounded-xl p-3">
        <div className="flex justify-between text-[10px] text-white/50 mb-1.5">
          <span>☁️ Cloud Storage Used</span>
          <span className="text-cyan-300 font-bold">{storageUsed}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full"
            style={{
              width: `${storageUsed}%`,
              background: 'linear-gradient(90deg, #0891b2, #06b6d4)',
              boxShadow: '0 0 6px rgba(6,182,212,0.5)',
            }} />
        </div>
        <div className="flex justify-between text-[8px] text-white/20 mt-1">
          <span>6.8 GB used</span><span>10 GB total</span>
        </div>
      </div>

      {/* Sync Settings */}
      <div className="glass-card rounded-xl p-3 space-y-3">
        <p className="text-yellow-300 text-xs font-bold">⚙️ Sync Settings</p>
        {[
          { label: 'Cloud Sync', val: cloudSync, set: setCloudSync, color: '#06b6d4' },
          { label: 'Auto Save (every change)', val: autoSave, set: setAutoSave, color: '#8b5cf6' },
          { label: 'Auto Backup', val: autoBackup, set: setAutoBackup, color: '#10b981' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-white/70 text-xs">{item.label}</span>
            <Toggle val={item.val} onChange={item.set} color={item.color} />
          </div>
        ))}
        <div>
          <div className="flex justify-between text-[10px] text-white/50 mb-1">
            <span>Sync Interval (min)</span>
            <span className="text-purple-400">{syncInterval} min</span>
          </div>
          <input type="range" min={1} max={60} value={syncInterval}
            onChange={e => setSyncInterval(+e.target.value)}
            className="w-full" style={{ accentColor: '#8b5cf6' }} />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/50 mb-1">
            <span>Max Backups to Keep</span>
            <span className="text-green-400">{maxBackups}</span>
          </div>
          <input type="range" min={3} max={30} value={maxBackups}
            onChange={e => setMaxBackups(+e.target.value)}
            className="w-full" style={{ accentColor: '#10b981' }} />
        </div>
      </div>

      {/* Audio/Output Settings */}
      <div className="glass-card rounded-xl p-3 space-y-3">
        <p className="text-pink-300 text-xs font-bold">🔊 Default Output Settings</p>
        <div>
          <p className="text-white/40 text-[10px] mb-1.5">Default Quality</p>
          <div className="flex flex-wrap gap-1.5">
            {['96kbps', '128kbps', '192kbps', '256kbps', '320kbps', 'Lossless'].map(q => (
              <button key={q} onClick={() => setQuality(q)}
                className={`text-[9px] px-2 py-1 rounded-full border transition-all ${quality === q ? 'bg-pink-700/40 border-pink-500 text-pink-300' : 'border-white/15 text-white/40 hover:border-white/30'}`}>
                {q}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white/40 text-[10px] mb-1.5">Default Output Format</p>
          <div className="flex flex-wrap gap-1.5">
            {['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A'].map(f => (
              <button key={f} onClick={() => setOutputFormat(f)}
                className={`text-[9px] px-2 py-1 rounded-full border transition-all ${outputFormat === f ? 'bg-orange-700/40 border-orange-500 text-orange-300' : 'border-white/15 text-white/40 hover:border-white/30'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sync Log */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-white/50 text-xs font-bold">📋 Activity Log</p>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {syncLogs.map(log => (
            <div key={log.id} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-green-400' : log.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`} />
              <span className="text-white/60 text-[10px] flex-1">{log.action}</span>
              <span className="text-white/25 text-[9px]">{log.time}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setSyncLogs([])}
          className="text-[9px] text-white/30 hover:text-white/60 transition-colors">Clear Log</button>
      </div>

      {/* Version Info */}
      <div className="glass-card rounded-xl p-3 space-y-1">
        <p className="text-white/50 text-xs font-bold">ℹ️ Version Info</p>
        <div className="grid grid-cols-2 gap-1 text-[9px]">
          <span className="text-white/30">App Version</span><span className="text-green-400">v1.0.0 — Ultra HDR+</span>
          <span className="text-white/30">Backend</span><span className="text-cyan-400">OnSpace Cloud v2</span>
          <span className="text-white/30">Build</span><span className="text-purple-400">2025.07.15</span>
          <span className="text-white/30">Engine</span><span className="text-yellow-400">React 18 + Vite 5</span>
        </div>
      </div>

      {/* Recovery */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-red-400 text-xs font-bold">🛡️ Recovery & Refresh</p>
        <p className="text-white/30 text-[10px] leading-relaxed">
          If any service interruption occurs, use these recovery options to restore full functionality and refresh all running processes.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '🔄 Refresh Services', color: '#06b6d4' },
            { label: '♻️ Restore Backup', color: '#8b5cf6' },
            { label: '🧹 Clear Cache', color: '#f59e0b' },
            { label: '⚡ Force Restart', color: '#ef4444' },
          ].map(btn => (
            <button key={btn.label}
              className="py-2 rounded-xl border text-[10px] font-bold text-white/70 hover:text-white transition-all hover:scale-[1.02]"
              style={{ borderColor: `${btn.color}40`, background: `${btn.color}10` }}
              onClick={() => console.log(btn.label)}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackendSettings;
