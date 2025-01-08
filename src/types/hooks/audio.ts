import type { MutableRefObject } from 'react';

/**
 * The parameter type for the useAudio hook.
 */
export interface UseAudioParams {
  autoplay?: boolean;
  enabledKeyboardControl?: boolean;
  loop?: boolean;
  maxPlaybackRange?: number;
  maxVolume?: number;
  preventDefaultKeyboardEvent?: boolean;
  src?: string;
  timeShift?: number;
}

/**
 * The return type for useAudioState hooks used inside useAudio.
 */
export interface UseAudioStateReturns {
  currentSrc: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  playbackRange: number;
  volume: number;
}

/**
 * The return type for useControlAudio hooks used inside useAudio.
 */
export interface UseControlAudioReturns {
  changeCurrentSrc: (currentSrc: string) => void;
  changeCurrentTime: (currentTime: number) => void;
  changeMuted: (muted: boolean) => void;
  changePlaybackRate: (playbackRate: number) => void;
  changePlaybackRange: (progress: number) => void;
  changeVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  resetAudio: () => void;
  resetAudioTime: () => void;
  shiftTimeBackward: () => void;
  shiftTimeForward: () => void;
  stop: () => void;
  toggleMuted: () => void;
  togglePlayPause: (src?: string) => void;
}

/**
 * The return type for the useAudio hook. Expand the useAudioStateReturns, useControlAudioReturns type.
 */
export interface UseAudioReturns extends UseAudioStateReturns, UseControlAudioReturns {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}
