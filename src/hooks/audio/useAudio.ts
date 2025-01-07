import { useEffect, useRef, useState, type MutableRefObject } from 'react';

import { AUDIO_DEFAULT_VALUE } from './_constants';
import type { UseAudioStateReturns } from './useAudioState';
import useAudioState from './useAudioState';
import type { UseControlAudioReturns } from './useControlAudio';
import useControlAudio from './useControlAudio';
import useKeyBinding from './useKeyboardControl';
import Hls from 'hls.js';

interface UseAudioParams {
  autoplay?: boolean;
  enabledKeyboardControl?: boolean;
  loop?: boolean;
  maxPlaybackRange?: number;
  maxVolume?: number;
  preventDefaultKeyboardEvent?: boolean;
  src?: string;
  timeShift?: number;
}

interface UseAudioReturns extends UseAudioStateReturns, UseControlAudioReturns {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}

/**
 * 오디오를 제어할 수 있는 훅입니다. 현재는 오디오 재생 및 볼륨 관련하여 조작과 사용이 가능합니다.
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
 * - `autoplay` : 오디오 자동 재생 여부 (default : false)
 * - `enabledKeyboardControl` : 키보드로 오디오 컨트롤 가능 여부 (default : false)
 * - `loop` : 오디오 반복 재생 여부 (default : false)
 * - `maxPlaybackRange` : 현재 재생 시간을 progress로 환산했을 때의 max 값 (default : 100)
 * - `maxVolume` : 현재 볼륨의 max 값 (default : 1)
 * - `preventDefaultKeyboardEvent` : 키보드 컨트롤 이벤트에서 preventDefault를 실행할지 여부 (default : true)
 * - `src` : 오디오 source url
 * - `timeShift` : 건너뛰기의 기준이 되는 시간(초) (default : 10)
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
 * - `playbackRange` : currentTime을 param으로 주어지는 maxPlaybackRange 단위로 환산한 값이며, maxPlaybackRange를 커스텀하지 않았을 경우 기본적으로 playbackRange는 퍼센트 단위로 환산됩니다.
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
    hlsRef,
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
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (src.substring(src.lastIndexOf('.') + 1) === 'm3u8' && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(audioRef.current);
      audioRef.current.src = src;
    }
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
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
