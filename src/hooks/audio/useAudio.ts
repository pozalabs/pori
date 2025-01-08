import { useEffect, useRef, useState } from 'react';

import { AUDIO_DEFAULT_VALUE } from './_constants';
import useAudioState from './useAudioState';
import useControlAudio from './useControlAudio';
import useKeyBinding from './useKeyboardControl';
import type { UseAudioParams, UseAudioReturns } from '../../types';

/**
 * This is a hook that allows controlling audio. Currently, it supports audio playback and volume control.
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
 * - `autoplay` : auto-play feature (default : false)
 * - `enabledKeyboardControl` : controls via keyboard (default : false)
 * - `loop` : audio repeat (default : false)
 * - `maxPlaybackRange` : The maximum value for progress, when converting the current playback time (default : 100)
 * - `maxVolume` : current max volume value (default : 1)
 * - `preventDefaultKeyboardEvent` : execute preventDefault in a keyboard control event (default : true)
 * - `src` : audio source url
 * - `timeShift` : skipping audio time(seconds) (default : 10)
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
 * - `playbackRange` : The currentTime is converted to a value based on the maxPlaybackRange parameter. If the maxPlaybackRange is not customized, the default playback range is converted to a percentage.
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
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  const { currentSrc, currentTime, duration, isPlaying, playbackRate, playbackRange, volume } =
    useAudioState({
      audioRef,
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

    return () => {
      if (!audio) return;

      audio.pause();
      audio.src = '';
      audio.load();
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
