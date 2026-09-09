import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onClose: () => void;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
  status: 'online' | 'editing' | 'idle' | 'away';
  lastAction: string;
  cursor?: { x: number; y: number };
}

interface ChatMsg {
  id: string;
  user: string;
  avatar: string;
  color: string;
  text: string;
  ts: string;
  type: 'message' | 'action';
}

interface SessionEdit {
  user: string;
  color: string;
  action: string;
  track?: string;
  ts: string;
}

const MOCK_COLLABORATORS: Collaborator[] = [
  { id: 'you', name: 'You (Owner)', avatar: '👑', color: '#f59e0b', role: 'Admin', status: 'online', lastAction: 'Joined session' },
  { id: 'c1', name: 'Ahmad Khan', avatar: '🎸', color: '#8b5cf6', role: 'Musician', status: 'editing', lastAction: 'Editing Guitar Track' },
  { id: 'c2', name: 'Sara Ali', avatar: '🎤', color: '#ec4899', role: 'Vocalist', status: 'online', lastAction: 'Reviewing mix' },
  { id: 'c3', name: 'DJ Storm', avatar: '🎧', color: '#06b6d4', role: 'DJ / Mixer', status: 'idle', lastAction: 'Uploaded beat loop' },
];

const MOCK_CHAT: ChatMsg[] = [
  { id: '1', user: 'Ahmad Khan', avatar: '🎸', color: '#8b5cf6', text: 'The guitar riff on bar 16 sounds amazing! 🎸', ts: '2:31 PM', type: 'message' },
  { id: '2', user: 'Sara Ali', avatar: '🎤', color: '#ec4899', text: 'Can we boost the vocals on the chorus?', ts: '2:33 PM', type: 'message' },
  { id: '3', user: 'System', avatar: '⚡', color: '#f59e0b', text: 'DJ Storm joined the session', ts: '2:34 PM', type: 'action' },
  { id: '4', user: 'DJ Storm', avatar: '🎧', color: '#06b6d4', text: 'Uploading the new beat loop now 🎵', ts: '2:35 PM', type: 'message' },
];

const RECENT_EDITS: SessionEdit[] = [
  { user: 'Ahmad Khan', color: '#8b5cf6', action: 'Modified step 8-12 on Guitar track', track: 'Guitar', ts: '2:36 PM' },
  { user: 'Sara Ali', color: '#ec4899', action: 'Adjusted vocals volume +8dB', track: 'Vocals', ts: '2:34 PM' },
  { user: 'DJ Storm', color: '#06b6d4', action: 'Added new sample to Beat track', track: 'Beat', ts: '2:35 PM' },
  { user: 'You', color: '#f59e0b', action: 'Started recording session', track: 'All', ts: '2:30 PM' },
];

const PROMPTS = [
  'Start a live studio session with remote musicians',
  'Invite vocalists for real-time collaborative recording',
  'Share mixing console access with your sound engineer',
  'Collaborate on beat production with a DJ remotely',
  'Create a virtual band jam session across continents',
  'Share project for feedback from music producer',
];

const CollaborationPanel: React.FC<Props> = ({ onClose }) => {
  const [collaborators] = useState<Collaborator[]>(MOCK_COLLABORATORS);
  const [chat, setChat] = useState<ChatMsg[]>(MOCK_CHAT);
  const [chatInput, setChatInput] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 8).toUpperCase());
  const [inviteLink] = useState(() => `https://studio.esworld.app/collab/${Math.random().toString(36).substr(2, 12)}`);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'session' | 'chat' | 'history'>('session');
  const [showPrompts, setShowPrompts] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulate real-time sync pulses
  useEffect(() => {
    const iv = setInterval(() => {
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 800);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // Simulate incoming messages
  useEffect(() => {
    const msgs = [
      { user: 'Ahmad Khan', avatar: '🎸', color: '#8b5cf6', text: 'This mix is fire! 🔥' },
      { user: 'Sara Ali', avatar: '🎤', color: '#ec4899', text: 'The reverb on my vocal track is perfect now 🎤' },
      { user: 'DJ Storm', avatar: '🎧', color: '#06b6d4', text: 'Ready to render the final mix?' },
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < msgs.length) {
        const m = msgs[i];
        setChat(prev => [...prev, {
          id: Date.now().toString(),
          ...m,
          ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'message',
        }]);
        i++;
      }
    }, 12000);
    return () => clearInterval(iv);
  }, []);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChat(prev => [...prev, {
      id: Date.now().toString(),
      user: 'You (Owner)',
      avatar: '👑',
      color: '#f59e0b',
      text: chatInput.trim(),
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'message',
    }]);
    setChatInput('');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const statusColors: Record<string, string> = { online: '#22c55e', editing: '#f59e0b', idle: '#94a3b8', away: '#f97316' };
  const statusLabel: Record<string, string> = { online: 'Online', editing: 'Editing…', idle: 'Idle', away: 'Away' };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-green-300" style={{ textShadow: '0 0 20px rgba(34,197,94,0.6)' }}>
          🤝 Real-Time Collaboration
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Prompts */}
      <div className="glass-card rounded-xl p-2.5">
        <button onClick={() => setShowPrompts(!showPrompts)} className="w-full flex items-center justify-between text-[10px] text-yellow-300 font-bold">
          <span>💡 Session Ideas ({PROMPTS.length})</span>
          <span>{showPrompts ? '▲' : '▼'}</span>
        </button>
        {showPrompts && (
          <div className="mt-2 space-y-1">
            {PROMPTS.map((p, i) => (
              <div key={i} className="text-[9px] text-white/50 p-1.5 rounded-lg hover:bg-white/5 hover:text-white/80 cursor-default">{p}</div>
            ))}
          </div>
        )}
      </div>

      {/* Session Status */}
      <div className="glass-panel-bright rounded-xl p-3 space-y-2" style={{ borderColor: 'rgba(34,197,94,0.4)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${syncStatus === 'synced' ? 'bg-green-400 animate-pulse' : syncStatus === 'syncing' ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{ boxShadow: `0 0 8px ${syncStatus === 'synced' ? 'rgba(34,197,94,0.8)' : 'rgba(245,158,11,0.8)'}` }} />
            <span className={`text-xs font-bold ${syncStatus === 'synced' ? 'text-green-400' : 'text-yellow-400'}`}>
              {syncStatus === 'synced' ? '● LIVE SESSION' : '⟳ SYNCING...'}
            </span>
          </div>
          <span className="text-[9px] font-mono text-white/30">ID: {sessionId}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="glass-card rounded-lg p-1.5">
            <p className="text-green-400 font-bold text-sm">{collaborators.length}</p>
            <p className="text-[8px] text-white/30">Online</p>
          </div>
          <div className="glass-card rounded-lg p-1.5">
            <p className="text-yellow-400 font-bold text-sm">{collaborators.filter(c => c.status === 'editing').length}</p>
            <p className="text-[8px] text-white/30">Editing</p>
          </div>
          <div className="glass-card rounded-lg p-1.5">
            <p className="text-cyan-400 font-bold text-sm">{chat.length}</p>
            <p className="text-[8px] text-white/30">Messages</p>
          </div>
        </div>
      </div>

      {/* Invite Link */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <p className="text-cyan-300 text-xs font-bold">🔗 Session Invite Link</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-[9px] text-white/40 font-mono truncate">
            {inviteLink}
          </div>
          <button onClick={copyInviteLink}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${linkCopied ? 'bg-green-700/40 border-green-500 text-green-300' : 'btn-secondary text-white/70'}`}>
            {linkCopied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
        <div className="flex gap-2">
          {['WhatsApp', 'Telegram', 'Email'].map(app => (
            <button key={app} className="flex-1 text-[9px] border border-white/10 text-white/40 py-1.5 rounded-lg hover:border-white/25 hover:text-white/70 transition-all">
              {app === 'WhatsApp' ? '💬' : app === 'Telegram' ? '✈️' : '📧'} {app}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {[
          { key: 'session', label: '👥 Members' },
          { key: 'chat', label: `💬 Chat (${chat.length})` },
          { key: 'history', label: '📋 History' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${activeTab === tab.key ? 'bg-green-900/30 border-green-500/60 text-green-300' : 'border-white/8 text-white/40 hover:border-white/20'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'session' && (
        <div className="space-y-2">
          {collaborators.map(c => (
            <div key={c.id} className="glass-card rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${c.color}20`, border: `1px solid ${c.color}40` }}>
                  {c.avatar}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black"
                  style={{ background: statusColors[c.status] }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-bold truncate">{c.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] px-1.5 rounded-full font-bold"
                    style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}40` }}>
                    {c.role}
                  </span>
                  <span className="text-[8px]" style={{ color: statusColors[c.status] }}>{statusLabel[c.status]}</span>
                </div>
                <p className="text-white/30 text-[8px] mt-0.5 truncate">{c.lastAction}</p>
              </div>
              {c.id !== 'you' && (
                <div className="flex flex-col gap-1">
                  <button className="text-[8px] text-cyan-400 border border-cyan-700/30 px-1.5 py-0.5 rounded hover:bg-cyan-900/20">Msg</button>
                  <button className="text-[8px] text-orange-400 border border-orange-700/30 px-1.5 py-0.5 rounded hover:bg-orange-900/20">Mute</button>
                </div>
              )}
            </div>
          ))}
          {/* Invite more */}
          <button className="w-full border-dashed border border-green-700/30 rounded-xl p-3 text-center hover:border-green-500/50 transition-colors">
            <p className="text-green-400/60 text-xs">+ Invite More Collaborators</p>
          </button>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="space-y-3">
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {chat.map(msg => (
              <div key={msg.id}
                className={`flex gap-2 ${msg.type === 'action' ? 'justify-center' : msg.user.includes('You') ? 'flex-row-reverse' : ''}`}>
                {msg.type === 'action' ? (
                  <div className="bg-white/5 rounded-full px-3 py-1">
                    <p className="text-[9px] text-white/30">{msg.text}</p>
                  </div>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `${msg.color}20`, border: `1px solid ${msg.color}40` }}>
                      {msg.avatar}
                    </div>
                    <div className={`max-w-[75%] ${msg.user.includes('You') ? 'items-end' : 'items-start'} flex flex-col`}>
                      <p className="text-[8px] mb-0.5" style={{ color: msg.color }}>{msg.user.includes('You') ? 'You' : msg.user}</p>
                      <div className="rounded-xl px-2.5 py-1.5"
                        style={{
                          background: msg.user.includes('You') ? `${msg.color}25` : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${msg.user.includes('You') ? `${msg.color}40` : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        <p className="text-white/80 text-[10px] leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-[7px] text-white/20 mt-0.5">{msg.ts}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-green-500/50" />
            <button onClick={sendMessage}
              className="btn-primary text-white px-3 py-2 rounded-xl text-xs font-bold">
              Send
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-1.5">
          {RECENT_EDITS.map((edit, i) => (
            <div key={i} className="glass-card rounded-xl p-2.5 flex items-start gap-2">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: edit.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold" style={{ color: edit.color }}>{edit.user}</p>
                <p className="text-white/60 text-[9px] leading-relaxed">{edit.action}</p>
                {edit.track && (
                  <span className="text-[8px] bg-white/5 border border-white/10 text-white/30 px-1.5 rounded mt-0.5 inline-block">{edit.track}</span>
                )}
              </div>
              <span className="text-[8px] text-white/20 flex-shrink-0">{edit.ts}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationPanel;
