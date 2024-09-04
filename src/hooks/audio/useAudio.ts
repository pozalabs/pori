import { useEffect, useRef, type MutableRefObject } from 'react';

import { AUDIO_DEFAULT_VALUE } from './_constants';
import type { UseAudioStateReturns } from './useAudioState';
import useAudioState from './useAudioState';
import type { UseControlAudioReturns } from './useControlAudio';
import useControlAudio from './useControlAudio';

interface UseAudioParams {
  autoplay?: boolean;
  maxProgressTime?: number;
  maxProgressVolume?: number;
  src?: string;
}

interface UseAudioReturns extends UseAudioStateReturns, UseControlAudioReturns {
  audioRef: MutableRefObject<HTMLAudioElement>;
}

const useAudio = ({
  autoplay = AUDIO_DEFAULT_VALUE.autoplay,
  maxProgressTime = AUDIO_DEFAULT_VALUE.maxProgressTime,
  maxProgressVolume = AUDIO_DEFAULT_VALUE.maxProgressVolume,
  src = AUDIO_DEFAULT_VALUE.src,
}: UseAudioParams): UseAudioReturns => {
  const audioRef = useRef(new Audio());

  const { currentSrc, currentTime, duration, isPlaying, progressTime, volume } = useAudioState({
    audioRef,
    maxProgressTime,
    maxProgressVolume,
  });

  const {
    changeCurrentSrc,
    changeCurrentTime,
    changeProgressTime,
    changeVolume,
    play,
    pause,
    resetAudioTime,
    toggleMuted,
    togglePlayPause,
  } = useControlAudio({ audioRef, maxProgressTime, maxProgressVolume, duration, isPlaying });

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
    progressTime,
    volume,
    changeCurrentSrc,
    changeCurrentTime,
    changeProgressTime,
    changeVolume,
    play,
    pause,
    resetAudioTime,
    toggleMuted,
    togglePlayPause,
  };
};

export default useAudio;
