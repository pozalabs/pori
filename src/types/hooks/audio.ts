import type { MutableRefObject } from 'react';

/**
 * Params for the useAudio hook.
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
 * Return type of useAudioState, used internally by useAudio.
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
 * Return type of useControlAudio, used internally by useAudio.
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
 * Return type of the useAudio hook. Extends UseAudioStateReturns and UseControlAudioReturns.
 */
export interface UseAudioReturns extends UseAudioStateReturns, UseControlAudioReturns {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}
