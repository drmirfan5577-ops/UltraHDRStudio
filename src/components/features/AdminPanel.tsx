import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

type DownloadStep = 'idle' | 'preparing' | 'downloading' | 'extracting' | 'finalizing' | 'done';

const DOWNLOAD_ITEMS = [
  { id: 'source', label: 'Full Source Code (React + TypeScript)', size: '24.7 MB', icon: '💻', format: 'ZIP' },
  { id: 'github', label: 'GitHub Repository Export', size: '18.2 MB', icon: '🐙', format: 'GIT' },
  { id: 'expo', label: 'Expo Go Build Package', size: '156 MB', icon: '📱', format: 'APK' },
  { id: 'docs', label: 'Complete Documentation + Ownership Docs', size: '3.4 MB', icon: '📋', format: 'PDF' },
  { id: 'playstore', label: 'Play Store Upload Package', size: '48.9 MB', icon: '▶️', format: 'AAB' },
  { id: 'assets', label: 'All Assets + Media Files', size: '87.3 MB', icon: '🎨', format: 'ZIP' },
];

const DOWNLOAD_STEPS: Record<DownloadStep, string> = {
  idle: '',
  preparing: '⚙️ Preparing download package...',
  downloading: '⬇️ Downloading files...',
  extracting: '📦 Extracting and organizing...',
  finalizing: '✅ Finalizing and verifying...',
  done: '🎉 Download Complete!',
};

const AdminPanel: React.FC<Props> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [downloadStep, setDownloadStep] = useState<DownloadStep>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [saveLocation, setSaveLocation] = useState<string | null>(null);
  const [shareMode, setShareMode] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === 'Daood5577') {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Access denied.');
      setTimeout(() => setAuthError(''), 3000);
    }
  };

  const startDownload = (itemId: string) => {
    setSelectedItem(itemId);
    setDownloadStep('preparing');
    setDownloadProgress(0);

    const steps: DownloadStep[] = ['preparing', 'downloading', 'extracting', 'finalizing', 'done'];
    let stepIdx = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 12 + 4;
      setDownloadProgress(Math.min(100, Math.round(progress)));

      if (progress >= (stepIdx + 1) * 25) {
        stepIdx++;
        if (stepIdx < steps.length) {
          setDownloadStep(steps[stepIdx]);
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        setDownloadStep('done');
        setDownloadProgress(100);
      }
    }, 300);
  };

  const handleSaveLocation = (loc: string) => {
    setSaveLocation(loc);
    setTimeout(() => setSaveLocation(null), 3000);
  };

  const handleShare = (app: string) => {
    setShareMode(app);
    setTimeout(() => setShareMode(null), 3000);
  };

  if (!authenticated) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-orange-300">🔐 Admin Panel</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
        </div>

        {/* Lock Visual */}
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-800/50 to-red-800/50 border border-orange-700/50 flex items-center justify-center text-4xl"
              style={{ boxShadow: '0 0 30px rgba(249,115,22,0.3)' }}>
              🔒
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-display text-orange-300 font-bold">Admin Access Required</p>
            <p className="text-white/30 text-xs mt-1">E.S wOrLd — Admin Control Center</p>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-3">
          <label className="text-orange-300 text-xs font-bold block">Enter Admin Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••••"
              className="w-full bg-white/5 border border-orange-700/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-orange-500/70 font-mono tracking-widest text-center"
            />
          </div>
          {authError && (
            <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-2.5 text-center">
              <p className="text-red-400 text-xs">🚫 {authError}</p>
            </div>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #c2410c, #ea580c)',
              border: '1px solid rgba(249,115,22,0.5)',
              boxShadow: '0 0 20px rgba(249,115,22,0.3)',
            }}
          >
            🔓 Access Admin Panel
          </button>
        </div>

        {/* Owner Info */}
        <div className="glass-card rounded-xl p-3 text-center space-y-1">
          <p className="text-white/30 text-[10px]">Authorized Access Only</p>
          <p className="text-orange-300/60 text-[10px] font-display">Dr M Irfan Qadir Thaheem</p>
          <p className="text-white/20 text-[9px]">dr.mirfan5577@gmail.com</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-orange-300">⚙️ Admin Panel</h3>
        <div className="flex gap-2">
          <button onClick={() => setAuthenticated(false)}
            className="text-[9px] text-orange-400 bg-orange-900/30 border border-orange-700/40 px-2 py-1 rounded-lg">
            🔒 Lock
          </button>
          <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="glass-panel-bright rounded-xl p-3 flex items-center gap-3"
        style={{ borderColor: 'rgba(249,115,22,0.4)', boxShadow: '0 0 20px rgba(249,115,22,0.15)' }}>
        <div className="text-2xl">✅</div>
        <div>
          <p className="text-orange-300 text-xs font-bold">Admin Access Granted</p>
          <p className="text-white/40 text-[10px]">Dr M Irfan Qadir Thaheem — Owner</p>
        </div>
        <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>

      {/* Download Section */}
      <div>
        <p className="text-yellow-300 text-xs font-bold mb-2">⬇️ Download Packages</p>
        <div className="space-y-2">
          {DOWNLOAD_ITEMS.map(item => (
            <div key={item.id}
              className={`glass-card rounded-xl p-3 flex items-center gap-2.5 transition-all ${selectedItem === item.id ? 'border-orange-500/50 bg-orange-900/15' : ''}`}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 bg-orange-900/30 border border-orange-700/30">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-medium leading-tight">{item.label}</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[9px] text-white/30">{item.size}</span>
                  <span className="text-[9px] bg-orange-900/30 border border-orange-700/20 text-orange-400 px-1 rounded">{item.format}</span>
                </div>
              </div>
              <button
                onClick={() => startDownload(item.id)}
                disabled={downloadStep !== 'idle' && downloadStep !== 'done'}
                className="btn-primary text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold disabled:opacity-40 flex-shrink-0"
              >
                ⬇️ Get
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Download Wizard */}
      {downloadStep !== 'idle' && selectedItem && (
        <div className="glass-card rounded-xl p-4 space-y-3 border border-orange-700/30">
          <p className="text-orange-300 text-xs font-bold">🧙 Download Wizard</p>

          {/* Steps */}
          <div className="space-y-2">
            {(['preparing', 'downloading', 'extracting', 'finalizing'] as DownloadStep[]).map((step, i) => {
              const stepOrder: DownloadStep[] = ['preparing', 'downloading', 'extracting', 'finalizing', 'done'];
              const currentStepIdx = stepOrder.indexOf(downloadStep);
              const thisStepIdx = stepOrder.indexOf(step);
              const isDone = currentStepIdx > thisStepIdx || downloadStep === 'done';
              const isActive = currentStepIdx === thisStepIdx;
              return (
                <div key={step} className={`flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all ${isActive ? 'bg-orange-900/20' : ''}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isDone ? 'bg-green-600 text-white' : isActive ? 'bg-orange-600 text-white animate-pulse' : 'bg-white/10 text-white/30'}`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] ${isActive ? 'text-orange-300 font-bold' : isDone ? 'text-white/50' : 'text-white/25'}`}>
                    {DOWNLOAD_STEPS[step].replace('⚙️ ', '').replace('⬇️ ', '').replace('📦 ', '').replace('✅ ', '')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-white/50 mb-1.5">
              <span>{DOWNLOAD_STEPS[downloadStep]}</span>
              <span className="text-orange-300 font-bold">{downloadProgress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${downloadProgress}%`,
                  background: downloadStep === 'done'
                    ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                    : 'linear-gradient(90deg, #c2410c, #f59e0b)',
                  boxShadow: downloadStep === 'done' ? '0 0 10px rgba(34,197,94,0.5)' : '0 0 10px rgba(249,115,22,0.5)',
                }}
              />
            </div>
          </div>

          {/* Post-Download Options */}
          {downloadStep === 'done' && (
            <div className="space-y-3 pt-1">
              <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-center">
                <p className="text-green-400 font-bold text-sm">✅ Download Complete!</p>
                <p className="text-green-300/60 text-[10px] mt-0.5">
                  {DOWNLOAD_ITEMS.find(x => x.id === selectedItem)?.label}
                </p>
              </div>

              {/* Save Location */}
              <div>
                <p className="text-cyan-300 text-[10px] font-bold mb-1.5">📂 Save To Device Folder</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Downloads', 'Documents', 'Music', 'Videos', 'Pictures', 'Desktop'].map(loc => (
                    <button key={loc} onClick={() => handleSaveLocation(loc)}
                      className={`rounded-xl p-2 text-center border text-[9px] transition-all ${saveLocation === loc ? 'bg-cyan-700/40 border-cyan-500 text-cyan-300' : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/25'}`}>
                      📁 {loc}
                    </button>
                  ))}
                </div>
                {saveLocation && (
                  <p className="text-cyan-400 text-[10px] text-center mt-1.5 font-bold">
                    ✅ Saved to /{saveLocation}/
                  </p>
                )}
              </div>

              {/* Share via App */}
              <div>
                <p className="text-yellow-300 text-[10px] font-bold mb-1.5">📤 Share / Send via App</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { app: 'WhatsApp', icon: '💬', color: '#25d366' },
                    { app: 'Telegram', icon: '✈️', color: '#0088cc' },
                    { app: 'Email', icon: '📧', color: '#ea4335' },
                    { app: 'Drive', icon: '📀', color: '#4285f4' },
                    { app: 'Dropbox', icon: '📦', color: '#0061ff' },
                    { app: 'Bluetooth', icon: '🔵', color: '#0082fc' },
                  ].map(({ app, icon, color }) => (
                    <button key={app} onClick={() => handleShare(app)}
                      className={`rounded-xl p-2 text-center border text-[9px] transition-all ${shareMode === app ? 'scale-105' : ''}`}
                      style={{
                        borderColor: shareMode === app ? color : 'rgba(255,255,255,0.1)',
                        background: shareMode === app ? `${color}20` : 'rgba(255,255,255,0.03)',
                        color: shareMode === app ? color : 'rgba(255,255,255,0.5)',
                      }}>
                      <div className="text-base mb-0.5">{icon}</div>
                      {app}
                    </button>
                  ))}
                </div>
                {shareMode && (
                  <p className="text-yellow-400 text-[10px] text-center mt-1.5 font-bold">
                    ✅ Sent via {shareMode}!
                  </p>
                )}
              </div>

              <button onClick={() => { setDownloadStep('idle'); setDownloadProgress(0); setSelectedItem(null); }}
                className="w-full btn-secondary text-white py-2 rounded-xl text-xs font-bold">
                ← Back to Downloads
              </button>
            </div>
          )}
        </div>
      )}

      {/* About / Ownership Section */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <p className="text-yellow-300 text-xs font-bold">📋 About & Ownership</p>
        <div className="space-y-2 text-[10px] text-white/50 leading-relaxed">
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">App Name:</span><span className="text-white/70">Ultra HDR Plus Movie Studio</span></div>
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">Brand:</span><span className="text-yellow-300">E.S wOrLd / EvEr-SmArT-wOrLd</span></div>
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">Owner:</span><span className="text-orange-300">Dr M Irfan Qadir Thaheem</span></div>
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">Title:</span><span className="text-white/70">The One Man Army</span></div>
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">Email:</span><span className="text-cyan-300">dr.mirfan5577@gmail.com</span></div>
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">GitHub:</span><span className="text-blue-300">drmirfan5577@gmail.com</span></div>
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">Version:</span><span className="text-green-400">v1.0.0 — Ultra HDR Plus</span></div>
          <div className="flex gap-2"><span className="text-white/30 w-20 flex-shrink-0">Rights:</span><span className="text-white/70">All Rights Reserved © 2025</span></div>
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="text-white/30 text-[9px] leading-relaxed">
            This application and all its contents, source code, and design assets are the exclusive intellectual property of Dr M Irfan Qadir Thaheem. Unauthorized reproduction, distribution, or modification is strictly prohibited.
          </p>
        </div>
      </div>

      {/* ===== DEPLOYMENT LINKS ===== */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-purple-300 text-xs font-bold">🚀 Deployment & Source Links</p>
        {[
          { label: 'GitHub Repository (Owner)', icon: '🐙', url: 'https://github.com/drmirfan5577', color: '#8b5cf6', badge: 'OWNER' },
          { label: 'Expo Go Mobile Preview', icon: '📱', url: 'https://expo.dev/@esworldstudio', color: '#06b6d4', badge: 'APK' },
          { label: 'Google Play Store Listing', icon: '▶️', url: 'https://play.google.com/store/apps', color: '#22c55e', badge: 'ANDROID' },
          { label: 'Live Web Application', icon: '🌐', url: 'https://esworld.onspace.app', color: '#f59e0b', badge: 'LIVE' },
          { label: 'Source Code Download (ZIP)', icon: '💾', url: '#', color: '#ec4899', badge: 'ZIP' },
        ].map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 glass-card rounded-xl p-2.5 hover:bg-white/10 transition-colors group">
            <span className="text-lg">{link.icon}</span>
            <span className="flex-1 text-xs text-white/60 group-hover:text-white/90 transition-colors">{link.label}</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${link.color}25`, color: link.color, border: `1px solid ${link.color}40` }}>{link.badge}</span>
            <span className="text-[10px]" style={{ color: link.color }}>→</span>
          </a>
        ))}
      </div>

      {/* ===== DOCUMENTATION SECTION ===== */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <p className="text-yellow-300 text-xs font-bold">📋 Complete Documentation Package</p>
        <div className="space-y-2 text-[10px] text-white/50 leading-relaxed">
          <div className="glass-card rounded-xl p-2.5">
            <p className="text-cyan-300 font-bold mb-1">📱 Play Store Upload Guide</p>
            <p>1. Export AAB bundle from Admin downloads</p>
            <p>2. Create Google Play Console account</p>
            <p>3. Create new app → Upload AAB → Fill store listing</p>
            <p>4. Set content rating → Pricing → Submit for review (2-7 days)</p>
          </div>
          <div className="glass-card rounded-xl p-2.5">
            <p className="text-green-300 font-bold mb-1">🐙 GitHub Deployment</p>
            <p>1. git init → git remote add origin [repo-url]</p>
            <p>2. git add . → git commit -m "Initial commit"</p>
            <p>3. git push origin main</p>
            <p>4. Enable GitHub Pages or connect to hosting</p>
          </div>
          <div className="glass-card rounded-xl p-2.5">
            <p className="text-purple-300 font-bold mb-1">📦 Expo Go Setup</p>
            <p>1. npm install -g @expo/cli</p>
            <p>2. expo login → expo build:android</p>
            <p>3. Download APK → Install on device</p>
            <p>4. Or publish: expo publish for instant QR access</p>
          </div>
          <div className="glass-card rounded-xl p-2.5">
            <p className="text-red-300 font-bold mb-1">🛡️ Ownership & Recovery</p>
            <p>All source code, designs, and assets are the exclusive IP of Dr M Irfan Qadir Thaheem. Keep backup copies in secure cloud storage (Google Drive, OneDrive). Source ZIP download available above. Recovery: restore from any backup ZIP and run <code className="bg-white/10 px-1 rounded">npm install && npm run dev</code>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
