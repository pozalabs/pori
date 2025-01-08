import type { RefObject } from 'react';

/**
 * This is the type of ref passed to `Waveform`. You can use waveformRef to bind the desired behavior to the waveform.
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
