import type { RefObject } from 'react';

/**
 * Ref handle for the `Waveform` component. Provides access to the waveform element and audio controls.
 */
export interface WaveformHandles {
  waveformRef: RefObject<HTMLDivElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  changeCurrentTime: (currentTime: number) => void;
}
