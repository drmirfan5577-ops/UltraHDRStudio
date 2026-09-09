import { useState, useCallback } from 'react';

export type ProcessingState = 'idle' | 'processing' | 'done' | 'error';

interface AudioEngineState {
  isPlaying: boolean;
  isRecording: boolean;
  processingState: ProcessingState;
  processingLabel: string;
  progress: number;
  selectedEffect: string;
  volume: number;
  pitch: number;
  speed: number;
  quality: string;
  outputFormat: string;
  vocalsOnly: boolean;
  bgOnly: boolean;
  noiseReduction: number;
  vocalBoost: number;
}

export function useAudioEngine() {
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    isRecording: false,
    processingState: 'idle',
    processingLabel: '',
    progress: 0,
    selectedEffect: '',
    volume: 80,
    pitch: 0,
    speed: 100,
    quality: '320',
    outputFormat: 'MP3',
    vocalsOnly: false,
    bgOnly: false,
    noiseReduction: 70,
    vocalBoost: 60,
  });

  const update = useCallback((patch: Partial<AudioEngineState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  const simulateProcess = useCallback((label: string, onDone?: () => void) => {
    update({ processingState: 'processing', processingLabel: label, progress: 0 });
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        update({ processingState: 'done', progress: 100 });
        onDone?.();
        setTimeout(() => update({ processingState: 'idle', progress: 0 }), 2000);
      } else {
        update({ progress: Math.round(p) });
      }
    }, 150);
  }, [update]);

  const togglePlay = useCallback(() => {
    update({ isPlaying: !state.isPlaying });
  }, [state.isPlaying, update]);

  const toggleRecord = useCallback(() => {
    update({ isRecording: !state.isRecording });
  }, [state.isRecording, update]);

  return { state, update, simulateProcess, togglePlay, toggleRecord };
}
