import { useEffect, useRef, useState } from 'react';

import type Hls from 'hls.js';

import { AUDIO_DEFAULT_VALUE } from './_constants';
import useAudioState from './useAudioState';
import useControlAudio from './useControlAudio';
import useKeyBinding from './useKeyboardControl';
import type { UseAudioParams, UseAudioReturns } from '../../types';

/**
 * Controls audio playback and volume.
 * @param UseAudioParams
 * ```
 * interface UseAudioParams {
 *    autoplay?: boolean;
 *    enabledKeyboardControl?: boolean;
 *    loop?: boolean;
 *    maxPlaybackRange?: number;
 *    maxVolume?: number;
 *    preventDefaultKeyboardEvent?: boolean;
 *    src?: string;
 *    timeShift?: number;
 * }
 * ```
 * - `autoplay` - Whether to auto-play on mount (default: `false`)
 * - `enabledKeyboardControl` - Whether to enable keyboard controls (default: `false`)
 * - `loop` - Whether to loop the audio (default: `false`)
 * - `maxPlaybackRange` - Maximum value for playback progress (default: `100`)
 * - `maxVolume` - Maximum volume value (default: `1`)
 * - `preventDefaultKeyboardEvent` - Whether to call preventDefault on keyboard events (default: `true`)
 * - `src` - Audio source URL
 * - `timeShift` - Time skip duration in seconds (default: `10`)
 * @returns
 * `UseAudioReturns`
 * ```
 * interface UseAudioReturns {
 *    audioRef: MutableRefObject<HTMLAudioElement>;
 *    currentSrc: string;
 *    currentTime: number;
 *    duration: number;
 *    isPlaying: boolean;
 *    playbackRate: number;
 *    playbackRange: number;
 *    volume: number;
 *    changeCurrentSrc: (currentSrc: string) => void;
 *    changeCurrentTime: (currentTime: number) => void;
 *    changeMuted: (muted: boolean) => void;
 *    changePlaybackRate: (playbackRate: number) => void;
 *    changePlaybackRange: (progress: number) => void;
 *    changeVolume: (volume: number) => void;
 *    play: () => void;
 *    pause: () => void;
 *    resetAudio: () => void;
 *    resetAudioTime: () => void;
 *    shiftTimeBackward: () => void;
 *    shiftTimeForward: () => void;
 *    stop: () => void;
 *    toggleMuted: () => void;
 *    togglePlayPause: (src?: string) => void;
 * }
 * ```
 * - `playbackRange` - Represents currentTime scaled to maxPlaybackRange. Defaults to a percentage (0-100).
 */
const useAudio = ({
  autoplay = AUDIO_DEFAULT_VALUE.autoplay,
  enabledKeyboardControl = AUDIO_DEFAULT_VALUE.enabledKeyboardControl,
  loop = AUDIO_DEFAULT_VALUE.loop,
  maxPlaybackRange = AUDIO_DEFAULT_VALUE.maxPlaybackRange,
  maxVolume = AUDIO_DEFAULT_VALUE.maxVolume,
  preventDefaultKeyboardEvent = AUDIO_DEFAULT_VALUE.preventDefaultKeyboardEvent,
  src = AUDIO_DEFAULT_VALUE.src,
  timeShift = AUDIO_DEFAULT_VALUE.timeShift,
}: UseAudioParams): UseAudioReturns => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  const { currentSrc, currentTime, duration, isPlaying, playbackRate, playbackRange, volume } =
    useAudioState({
      audioRef,
      hlsRef,
      isAudioInitialized,
      maxPlaybackRange,
      maxVolume,
    });

  const {
    changeCurrentSrc,
    changeCurrentTime,
    changeMuted,
    changePlaybackRate,
    changePlaybackRange,
    changeVolume,
    play,
    pause,
    resetAudio,
    resetAudioTime,
    shiftTimeBackward,
    shiftTimeForward,
    stop,
    toggleMuted,
    togglePlayPause,
  } = useControlAudio({
    audioRef,
    maxPlaybackRange,
    maxVolume,
    duration,
    isPlaying,
    timeShift,
  });

  useKeyBinding({
    enabled: enabledKeyboardControl,
    preventDefault: preventDefaultKeyboardEvent,
    duration,
    isPlaying,
    changeCurrentTime,
    shiftTimeBackward,
    shiftTimeForward,
    toggleMuted,
    togglePlayPause,
  });

  useEffect(() => {
    audioRef.current = new Audio();
    setIsAudioInitialized(true);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.src = src;
  }, [src]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.autoplay = autoplay;
  }, [autoplay]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.loop = loop;
  }, [loop]);

  useEffect(() => {
    const audio = audioRef.current;
    const hls = hlsRef.current;

    return () => {
      if (!audio) return;

      audio.pause();
      audio.src = '';
      audio.load();

      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return {
    audioRef,
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    playbackRate,
    playbackRange,
    volume,
    changeCurrentSrc,
    changeCurrentTime,
    changeMuted,
    changePlaybackRate,
    changePlaybackRange,
    changeVolume,
    play,
    pause,
    resetAudio,
    resetAudioTime,
    shiftTimeBackward,
    shiftTimeForward,
    stop,
    toggleMuted,
    togglePlayPause,
  };
};

export default useAudio;
