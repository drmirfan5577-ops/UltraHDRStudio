export interface Feature {
  id: string;
  label: string;
  labelUrdu?: string;
  icon: string;
  color: string;
  glowColor: string;
  sidebarKey: string;
}

export interface AudioEffect {
  id: string;
  name: string;
  active: boolean;
}

export interface QualityOption {
  label: string;
  value: string;
  bitrate?: string;
}

export interface ConvertFormat {
  ext: string;
  label: string;
  type: 'audio' | 'video';
}

export interface Background3D {
  id: string;
  name: string;
  gradient: string;
  animation?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export type SidebarKey =
  | 'audio-effects'
  | 'video-maker'
  | 'noise-remover'
  | 'vocal-tools'
  | 'voice-changer'
  | 'converter'
  | 'karaoke'
  | 'backgrounds'
  | 'equalizer'
  | 'recorder'
  | 'media-player'
  | 'ai-secretary'
  | 'export'
  | 'ai-video'
  | 'logo-creator'
  | 'cloud-gallery'
  | 'lyrics'
  | 'admin'
  | 'subtitle-editor'
  | 'multi-track-mixer'
  | 'waveform-editor'
  | 'backend-settings'
  | 'public-info'
  | 'screen-recorder'
  | 'vocal-separator'
  | 'beat-maker'
  | 'collaboration'
  | 'theme-selector'
  | null;
