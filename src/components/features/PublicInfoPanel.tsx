import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

type Section = 'about' | 'vision' | 'disclaimer' | 'copyright' | 'contact';

const PublicInfoPanel: React.FC<Props> = ({ onClose }) => {
  const [active, setActive] = useState<Section>('about');

  const tabs: { key: Section; label: string; icon: string }[] = [
    { key: 'about', label: 'About Us', icon: '🌐' },
    { key: 'vision', label: 'Vision & Mission', icon: '🎯' },
    { key: 'disclaimer', label: 'Disclaimer', icon: '⚠️' },
    { key: 'copyright', label: 'Copyright', icon: '©️' },
    { key: 'contact', label: 'Contact', icon: '📬' },
  ];

  const renderContent = () => {
    switch (active) {
      case 'about':
        return (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3 glow-purple pulse-glow">
                ES
              </div>
              <h2 className="font-display text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-yellow-400 leading-tight">
                E.S wOrLd
              </h2>
              <p className="text-white/50 text-xs mt-1">EvEr-SmArT-wOrLd</p>
            </div>

            <div className="glass-card rounded-xl p-3 text-white/60 text-xs leading-relaxed space-y-3">
              <p>
                <strong className="text-cyan-300">Ultra HDR Plus Movie Studio</strong> is a next-generation professional audio and video creation platform developed by <strong className="text-purple-300">Dr M Irfan Qadir Thaheem</strong> — The One Man Army — under the brand <strong className="text-yellow-300">E.S wOrLd (EvEr-SmArT-wOrLd)</strong>.
              </p>
              <p>
                This platform is designed for content creators, musicians, film producers, podcasters, and digital artists who demand the highest quality in audio/video production, with an intuitive interface and studio-grade tools accessible on any device.
              </p>
              <p>
                We envision a world where <strong className="text-green-300">professional media creation is universally accessible</strong> — regardless of location, budget, or technical expertise. Our platform democratizes Hollywood-grade and concert-quality production tools for everyone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🎬', label: 'Video Generation', desc: 'AI-powered 4K/8K video creation' },
                { icon: '🎵', label: 'Audio Studio', desc: '320kbps lossless audio processing' },
                { icon: '🤖', label: 'AI Secretary', desc: 'Intelligent creative assistant' },
                { icon: '🌌', label: '30+ Backgrounds', desc: 'Stunning 3D/4D live environments' },
              ].map(f => (
                <div key={f.label} className="glass-card rounded-xl p-2.5">
                  <div className="text-xl mb-1">{f.icon}</div>
                  <p className="text-white text-[10px] font-bold">{f.label}</p>
                  <p className="text-white/30 text-[9px]">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-3 text-center">
              <p className="font-display text-xs font-bold text-purple-300">A Global Family Platform</p>
              <p className="text-white/40 text-[10px] mt-1 leading-relaxed">
                Uniting creators, artists, musicians, and storytellers across every language, culture, and corner of the world — building a digital home for every voice.
              </p>
            </div>
          </div>
        );

      case 'vision':
        return (
          <div className="space-y-4">
            <div className="glass-panel-bright rounded-xl p-4" style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌟</span>
                <p className="font-display text-sm font-bold text-yellow-300">Our Vision</p>
              </div>
              <p className="text-white/70 text-xs leading-relaxed">
                To become the world's most powerful, accessible, and innovative multimedia studio platform — empowering every individual, creator, and artist to express their full creative potential through cutting-edge AI-assisted audio/video production tools, without barriers of cost, geography, or expertise.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['🌍 Global Reach', '🤝 Universal Access', '💡 Innovation First', '🎨 Creative Freedom'].map(t => (
                  <span key={t} className="text-[9px] bg-yellow-900/30 border border-yellow-700/30 text-yellow-300 rounded-full px-2 py-0.5">{t}</span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎯</span>
                <p className="font-display text-sm font-bold text-cyan-300">Our Mission</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: '🔬', text: 'Deliver professional studio-quality tools in an accessible web and mobile format accessible to everyone worldwide.' },
                  { icon: '🤖', text: 'Harness the power of Artificial Intelligence to enhance creativity, automate complex processes, and inspire new artistic directions.' },
                  { icon: '🌐', text: 'Build a global community of creators, with multilingual support, real-time collaboration, and cross-platform compatibility.' },
                  { icon: '🛡️', text: 'Ensure data security, privacy, and creative ownership rights for every user and creator on the platform.' },
                  { icon: '📈', text: 'Continuously evolve with emerging technologies including spatial audio, volumetric video, AR/VR, and generative AI media.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                    <p className="text-white/60 text-[10px] leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-3">
              <p className="font-display text-xs font-bold text-purple-300 mb-2">🌍 A Global Family Platform</p>
              <p className="text-white/50 text-[10px] leading-relaxed">
                E.S wOrLd is not just an app — it is a <strong className="text-white/80">global creative family</strong>. We welcome creators from every culture, language, and background. Our platform supports Urdu, English, and will expand to 30+ languages. We believe every human voice, story, and musical note deserves to be heard and celebrated worldwide.
              </p>
            </div>
          </div>
        );

      case 'disclaimer':
        return (
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚠️</span>
                <p className="font-display text-sm font-bold text-red-300">Important Disclaimers</p>
              </div>
              <div className="space-y-3 text-[10px] text-white/60 leading-relaxed">
                <p><strong className="text-red-300">1. Platform Purpose:</strong> Ultra HDR Plus Movie Studio is designed exclusively for lawful personal, educational, and professional media creation. The platform must not be used for any illegal, harmful, defamatory, or copyright-infringing activities.</p>
                <p><strong className="text-red-300">2. Simulated Processing:</strong> Certain advanced AI features (e.g., real-time neural noise removal, AI video generation rendering) are showcased as interactive UI demonstrations. Full computational processing requires server-side integration which is continuously being upgraded.</p>
                <p><strong className="text-red-300">3. Third-Party Content:</strong> Users are solely responsible for ensuring they have proper rights, licenses, and permissions for any audio, video, image, or other media they upload or process through this platform.</p>
                <p><strong className="text-red-300">4. No Warranty:</strong> This platform is provided "as is" without warranty of any kind. While we strive for 100% uptime and reliability, we do not guarantee uninterrupted service or that the platform will be free from errors.</p>
                <p><strong className="text-red-300">5. Data Privacy:</strong> We collect minimal data necessary for service operation. We do not sell personal data to third parties. All files processed through the platform are treated with strict confidentiality.</p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-3">
              <p className="text-yellow-300 text-xs font-bold mb-2">🔞 Age & Usage Restrictions</p>
              <p className="text-white/50 text-[10px] leading-relaxed">
                This platform is intended for users aged 13 and above. Users under 18 should obtain parental consent before creating accounts or uploading content. The platform may not be used to create, distribute, or promote content that is illegal, harmful to minors, or violates applicable laws in your jurisdiction.
              </p>
            </div>
          </div>
        );

      case 'copyright':
        return (
          <div className="space-y-4">
            <div className="glass-panel-bright rounded-xl p-4" style={{ borderColor: 'rgba(139,92,246,0.4)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">©️</span>
                <p className="font-display text-sm font-bold text-purple-300">Copyright Notice</p>
              </div>
              <div className="space-y-2 text-[10px] text-white/60 leading-relaxed">
                <p>
                  Copyright © 2025 <strong className="text-white/90">Dr M Irfan Qadir Thaheem</strong>. All Rights Reserved.
                </p>
                <p>
                  All content, source code, design assets, user interface elements, brand identity, logos, visual compositions, and intellectual property associated with <strong className="text-purple-300">Ultra HDR Plus Movie Studio</strong> and <strong className="text-yellow-300">E.S wOrLd (EvEr-SmArT-wOrLd)</strong> are the exclusive property of Dr M Irfan Qadir Thaheem.
                </p>
                <p>
                  Unauthorized reproduction, modification, distribution, sublicensing, resale, or public display of any part of this platform — whether in source code, compiled form, or any derivative work — is strictly prohibited and constitutes copyright infringement under applicable national and international copyright law.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-3 space-y-2">
              <p className="text-cyan-300 text-xs font-bold">🛡️ Intellectual Property Rights</p>
              {[
                { icon: '💻', label: 'Source Code', desc: 'Exclusively owned, all rights reserved' },
                { icon: '🎨', label: 'UI/UX Design', desc: 'Original creative work, protected' },
                { icon: '🏷️', label: 'Brand & Logo', desc: 'Trademarked — E.S wOrLd / EvEr-SmArT-wOrLd' },
                { icon: '🤖', label: 'AI Systems', desc: 'Proprietary algorithms and models' },
                { icon: '📱', label: 'Mobile App', desc: 'Android/iOS — all versions protected' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-white/70 text-[10px] font-semibold">{item.label}</p>
                    <p className="text-white/30 text-[9px]">{item.desc}</p>
                  </div>
                  <span className="text-green-400 text-[9px]">✓</span>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-3">
              <p className="text-yellow-300 text-xs font-bold mb-2">📋 License Summary</p>
              <div className="text-[9px] text-white/50 space-y-1 leading-relaxed">
                <p>✅ You may USE the platform for personal and commercial media creation.</p>
                <p>✅ You RETAIN full ownership of content you create using this platform.</p>
                <p>❌ You may NOT copy, distribute or sell the platform itself or its source code.</p>
                <p>❌ You may NOT reverse engineer, decompile, or attempt to extract source code.</p>
                <p>❌ You may NOT use the E.S wOrLd brand or logo without written permission.</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4 text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-2xl mx-auto">
                👨‍💻
              </div>
              <p className="font-display text-sm font-bold text-orange-300">Dr M Irfan Qadir Thaheem</p>
              <p className="text-white/40 text-[10px]">The One Man Army · Founder & Developer</p>
              <p className="text-yellow-300 text-xs font-bold">E.S wOrLd / EvEr-SmArT-wOrLd</p>
            </div>

            {[
              { icon: '📧', label: 'Primary Email', value: 'dr.mirfan5577@gmail.com', color: '#ea4335' },
              { icon: '🐙', label: 'GitHub Account', value: 'drmirfan5577@gmail.com', color: '#8b5cf6' },
              { icon: '📱', label: 'WhatsApp / Contact', value: '+92 (Pakistan)', color: '#25d366' },
              { icon: '🌐', label: 'Web App (Live)', value: 'esworld.onspace.app', color: '#06b6d4' },
            ].map(c => (
              <div key={c.label} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${c.color}20`, border: `1px solid ${c.color}40` }}>
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-[9px]">{c.label}</p>
                  <p className="text-white/80 text-[11px] font-medium">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-white/40 text-[10px] leading-relaxed">
                For business inquiries, licensing, partnerships, custom development requests, or support, please reach out via email. Response time: within 24-48 hours.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-purple-300 glow-text-purple">ℹ️ About & Info</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActive(tab.key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${active === tab.key ? 'bg-purple-700/50 border-purple-500 text-purple-300' : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'}`}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default PublicInfoPanel;
