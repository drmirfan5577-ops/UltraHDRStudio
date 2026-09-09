import React from 'react';
import type { SidebarKey } from '@/types';
import AudioEffectsPanel from './AudioEffectsPanel';
import NoiseRemoverPanel from './NoiseRemoverPanel';
import VoiceChangerPanel from './VoiceChangerPanel';
import VideoMakerPanel from './VideoMakerPanel';
import ConverterPanel from './ConverterPanel';
import RecorderPanel from './RecorderPanel';
import EqualizerPanel from './EqualizerPanel';
import KaraokePanel from './KaraokePanel';
import MediaPlayerPanel from './MediaPlayerPanel';
import ExportPanel from './ExportPanel';
import BackgroundSelector from './BackgroundSelector';
import AIVideoGenerator from './AIVideoGenerator';
import ImageLogoCreator from './ImageLogoCreator';
import CloudGallery from './CloudGallery';
import LyricsPanel from './LyricsPanel';
import AdminPanel from './AdminPanel';
import SubtitleEditor from './SubtitleEditor';
import MultiTrackMixer from './MultiTrackMixer';
import WaveformEditor from './WaveformEditor';
import BackendSettings from './BackendSettings';
import PublicInfoPanel from './PublicInfoPanel';
import ScreenRecorder from './ScreenRecorder';
import VocalSeparator from './VocalSeparator';
import BeatMaker from './BeatMaker';
import CollaborationPanel from './CollaborationPanel';
import ThemeSelector from './ThemeSelector';

interface Props {
  activeSidebar: SidebarKey;
  onClose: () => void;
  activeBackground: string;
  onSelectBackground: (id: string) => void;
  activeTheme: string;
  onSelectTheme: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ activeSidebar, onClose, activeBackground, onSelectBackground, activeTheme, onSelectTheme }) => {
  const isOpen = activeSidebar !== null;

  const renderContent = () => {
    switch (activeSidebar) {
      case 'audio-effects': return <AudioEffectsPanel onClose={onClose} />;
      case 'noise-remover': return <NoiseRemoverPanel onClose={onClose} />;
      case 'vocal-tools': return <NoiseRemoverPanel onClose={onClose} />;
      case 'voice-changer': return <VoiceChangerPanel onClose={onClose} />;
      case 'video-maker': return <VideoMakerPanel onClose={onClose} />;
      case 'converter': return <ConverterPanel onClose={onClose} />;
      case 'recorder': return <RecorderPanel onClose={onClose} />;
      case 'equalizer': return <EqualizerPanel onClose={onClose} />;
      case 'karaoke': return <KaraokePanel onClose={onClose} />;
      case 'media-player': return <MediaPlayerPanel onClose={onClose} />;
      case 'export': return <ExportPanel onClose={onClose} />;
      case 'ai-video': return <AIVideoGenerator onClose={onClose} />;
      case 'logo-creator': return <ImageLogoCreator onClose={onClose} />;
      case 'cloud-gallery': return <CloudGallery onClose={onClose} />;
      case 'lyrics': return <LyricsPanel onClose={onClose} />;
      case 'admin': return <AdminPanel onClose={onClose} />;
      case 'subtitle-editor': return <SubtitleEditor onClose={onClose} />;
      case 'multi-track-mixer': return <MultiTrackMixer onClose={onClose} />;
      case 'waveform-editor': return <WaveformEditor onClose={onClose} />;
      case 'backend-settings': return <BackendSettings onClose={onClose} />;
      case 'public-info': return <PublicInfoPanel onClose={onClose} />;
      case 'screen-recorder': return <ScreenRecorder onClose={onClose} />;
      case 'vocal-separator': return <VocalSeparator onClose={onClose} />;
      case 'beat-maker': return <BeatMaker onClose={onClose} />;
      case 'collaboration': return <CollaborationPanel onClose={onClose} />;
      case 'theme-selector': return <ThemeSelector onClose={onClose} activeTheme={activeTheme} onSelectTheme={(id) => { onSelectTheme(id); }} />;
      case 'backgrounds': return (
        <BackgroundSelector
          activeBackground={activeBackground}
          onClose={onClose}
          onSelect={(id) => { onSelectBackground(id); }}
        />
      );
      default: return null;
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`sidebar-panel glass-panel neon-border-purple ${isOpen ? 'open' : ''}`}>
        {renderContent()}
      </div>
    </>
  );
};

export default Sidebar;
