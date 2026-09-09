import React, { useState } from 'react';
import type { ChatMessage } from '@/types';
import { useDraggable } from '@/hooks/useDraggable';
import aiSecretaryImg from '@/assets/ai-secretary.png';

const AI_SUGGESTIONS = [
  "Generate a cinematic trailer prompt with epic orchestral sound",
  "Create a karaoke version of any song with vocal removal",
  "Suggest 5 audio effects combos for rock music production",
  "Explain how to use noise remover for podcast recording",
  "Generate an Ultra HDR video export workflow",
  "Create ambient background music with echo and reverb",
  "Suggest vocal enhancement settings for live concert recording",
  "How to convert MP4 to FLAC lossless audio?",
];

const AI_RESPONSES: Record<string, string> = {
  default: `✨ **Ultra Studio AI** at your service!

I can help you:
• **Generate prompts** for audio/video production
• **Explore features** — effects, converter, recorder
• **Suggest workflows** for studio-quality output
• **Create content ideas** for your projects

What would you like to create today?`,
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('karaoke') || lower.includes('vocal')) {
    return `🎤 **Vocal/Karaoke Workflow:**

1. Load your audio file in **Media Player**
2. Open **Vocal Tools** → Enable "Just Vocals" or "Just Background"
3. Apply **Noise Remover** at 70–80% to clean the track
4. Use **Vocal Booster** at +6dB for crisp clarity
5. Export as **WAV 320kbps** for studio quality

**Tip:** Use the Echo effect at 15% for concert-hall feel! 🎭`;
  }
  if (lower.includes('noise') || lower.includes('denoise')) {
    return `🔇 **AI DeNoise Workflow:**

1. Go to **DeNoise** panel in the sidebar
2. Set noise reduction to **70–85%** for voice recordings
3. Enable **Background D-Noise** for music tracks
4. Apply **Vocal Purifier** for ultra-clear output
5. Preview → Export as FLAC for lossless result

**Best for:** Podcast, interview, studio recording! 🎙️`;
  }
  if (lower.includes('convert') || lower.includes('format')) {
    return `🔄 **Format Converter Guide:**

**Audio Formats:** WAV, MP3, AAC, M4A, OGG, FLAC, SAC
**Video Formats:** MP4, UHD 4K, MKV, MOV, AVI

**Quality Settings:**
• 96–128 kbps → Streaming/web
• 192–256 kbps → High quality
• 320 kbps → Studio standard
• FLAC/Lossless → Professional archiving

Open **Converter** sidebar → Select input file → Choose format → Process! ⚡`;
  }
  if (lower.includes('prompt')) {
    return `🎬 **Cinematic Video Prompt:**

"Ultra HDR 4K cinematic sequence — golden hour lighting, dramatic orchestral soundtrack with 320kbps audio clarity, slow-motion camera pan across neon-lit cityscape, crystal-clear vocals over ambient soundscape, professional color grading with deep shadow contrast, 3D spatial audio with concert-hall reverb effect."

**Settings to use:**
• Video: UHD 4K output
• Audio: 320 kbps + Reverb + Bass Boost
• Effect: Concert Hall + 3D Surround`;
  }
  return `🌟 **Processing your request...**

Based on: "${input}"

**Suggested workflow:**
1. Open the relevant panel from the main dashboard
2. Load your media file (supports all formats)
3. Apply effects using the sidebar controls
4. Preview in real-time with the built-in player
5. Export in your preferred format & quality

Need more specific help? Ask me about any feature! 🎵`;
}

interface AISecretaryProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const AISecretary: React.FC<AISecretaryProps> = ({ open, onOpen, onClose }) => {
  const { pos, onMouseDown } = useDraggable({ x: window.innerWidth - 90, y: window.innerHeight - 150 });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: AI_RESPONSES.default, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date() };
    const aiMsg: ChatMessage = { role: 'ai', content: getAIResponse(msg), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const nextSuggestion = () => setSuggestionIndex(i => (i + 1) % AI_SUGGESTIONS.length);

  return (
    <>
      {/* Floating Mango Bubble */}
      <div
        className="mango-bubble fixed z-[200] cursor-grab select-none"
        style={{ left: pos.x, top: pos.y, touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        onClick={open ? onClose : onOpen}
        title="AI Secretary — Click to open"
      >
        <div className="relative w-14 h-14 flex items-center justify-center">
          <img src={aiSecretaryImg} alt="AI Secretary" className="w-12 h-12 object-contain rounded-full" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-black animate-pulse"></span>
          {!open && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-yellow-300 text-[9px] px-1.5 py-0.5 rounded-full font-mono">
              AI 🥭
            </div>
          )}
        </div>
      </div>

      {/* AI Secretary Panel */}
      {open && (
        <div
          className="fixed z-[199] glass-panel neon-border-purple rounded-2xl flex flex-col overflow-hidden"
          style={{
            right: 16,
            bottom: 16,
            width: 'min(380px, 95vw)',
            height: 'min(520px, 80vh)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-cyan-900/30">
            <img src={aiSecretaryImg} alt="AI" className="w-8 h-8 rounded-full object-contain" />
            <div className="flex-1">
              <div className="text-yellow-300 font-display text-xs font-bold glow-text-gold">🥭 AI Secretary</div>
              <div className="text-green-400 text-[10px]">● Always Active — Ultra Studio AI</div>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-purple-700/60 text-white border border-purple-500/30'
                      : 'bg-white/5 text-gray-200 border border-white/10'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chip */}
          <div className="px-3 py-1">
            <button
              onClick={() => { sendMessage(AI_SUGGESTIONS[suggestionIndex]); nextSuggestion(); }}
              className="w-full text-left text-[10px] text-cyan-300 bg-cyan-900/20 border border-cyan-800/40 rounded-lg px-3 py-2 hover:bg-cyan-900/40 transition-colors truncate"
            >
              💡 {AI_SUGGESTIONS[suggestionIndex]}
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-white/10">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask AI Secretary..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-purple-500/60"
            />
            <button
              onClick={() => sendMessage()}
              className="btn-primary text-white rounded-xl px-3 py-2 text-xs font-bold"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AISecretary;
