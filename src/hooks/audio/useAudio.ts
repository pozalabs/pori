import { useEffect, useRef, type MutableRefObject } from 'react';

import { AUDIO_DEFAULT_VALUE } from './_constants';
import type { UseAudioStateReturns } from './useAudioState';
import useAudioState from './useAudioState';
import type { UseControlAudioReturns } from './useControlAudio';
import useControlAudio from './useControlAudio';

interface UseAudioParams {
  autoplay?: boolean;
  maxPlaybackRange?: number;
  maxProgressVolume?: number;
  src?: string;
}

interface UseAudioReturns extends UseAudioStateReturns, UseControlAudioReturns {
  audioRef: MutableRefObject<HTMLAudioElement>;
}

/**
 * 오디오를 제어할 수 있는 훅입니다. 현재는 오디오 재생 및 볼륨 관련하여 조작과 사용이 가능합니다.
 * @param UseAudioParams
 * ```
 * interface UseAudioParams {
 *    autoplay?: boolean;
 *    maxPlaybackRange?: number;
 *    maxProgressVolume?: number;
 *    src?: string;
 * }
 * ```
 * - `autoplay` : 오디오 자동 재생 여부 (default : false)
 * - `maxPlaybackRange` : 현재 재생 시간을 progress로 환산했을 때의 max 값 (default : 100)
 * - `maxProgressVolume` : 현재 볼륨의 max 값 (default : 1)
 * - `src` : 오디오 source url
 * @returns
 * `UseAudioReturns`
 * ```
 * interface UseAudioReturns {
 *    audioRef: MutableRefObject<HTMLAudioElement>;
 *    currentSrc: string;
 *    currentTime: number;
 *    duration: number;
 *    isPlaying: boolean;
 *    playbackRange: number;
 *    volume: number;
 *    changeCurrentSrc: (currentSrc: string) => void;
 *    changeCurrentTime: (currentTime: number) => void;
 *    changePlaybackRange: (progress: number) => void;
 *    changeVolume: (volume: number) => void;
 *    play: () => void;
 *    pause: () => void;
 *    resetAudioTime: () => void;
 *    toggleMuted: () => void;
 *    togglePlayPause: (src?: string) => void;
 * }
 * ```
 * - `playbackRange` : currentTime을 param으로 주어지는 maxPlaybackRange 단위로 환산한 값이며, maxPlaybackRange를 커스텀하지 않았을 경우 기본적으로 playbackRange는 퍼센트 단위로 환산됩니다.
 */
const useAudio = ({
  autoplay = AUDIO_DEFAULT_VALUE.autoplay,
  maxPlaybackRange = AUDIO_DEFAULT_VALUE.maxPlaybackRange,
  maxProgressVolume = AUDIO_DEFAULT_VALUE.maxProgressVolume,
  src = AUDIO_DEFAULT_VALUE.src,
}: UseAudioParams): UseAudioReturns => {
  const audioRef = useRef(new Audio());

  const { currentSrc, currentTime, duration, isPlaying, playbackRange, volume } = useAudioState({
    audioRef,
    maxPlaybackRange,
    maxProgressVolume,
  });

  const {
    changeCurrentSrc,
    changeCurrentTime,
    changePlaybackRange,
    changeVolume,
    play,
    pause,
    resetAudioTime,
    toggleMuted,
    togglePlayPause,
  } = useControlAudio({ audioRef, maxPlaybackRange, maxProgressVolume, duration, isPlaying });

  useEffect(() => {
    audioRef.current.src = src;
  }, [src]);

  useEffect(() => {
    audioRef.current.autoplay = autoplay;
  }, [autoplay]);

  return {
    audioRef,
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    playbackRange,
    volume,
    changeCurrentSrc,
    changeCurrentTime,
    changePlaybackRange,
    changeVolume,
    play,
    pause,
    resetAudioTime,
    toggleMuted,
    togglePlayPause,
  };
};

export default useAudio;
