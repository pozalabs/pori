import type { MutableRefObject } from 'react';
import { useCallback } from 'react';

interface UseControlAudioParams {
  audioRef: MutableRefObject<HTMLAudioElement>;
  maxPlaybackRange: number;
  maxProgressVolume: number;
  duration: number;
  isPlaying: boolean;
}

export interface UseControlAudioReturns {
  changeCurrentSrc: (currentSrc: string) => void;
  changeCurrentTime: (currentTime: number) => void;
  changePlaybackRange: (progress: number) => void;
  changeVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  resetAudioTime: () => void;
  toggleMuted: () => void;
  togglePlayPause: (src?: string) => void;
}

const useControlAudio = ({
  audioRef,
  maxPlaybackRange,
  maxProgressVolume,
  duration,
  isPlaying,
}: UseControlAudioParams): UseControlAudioReturns => {
  const changeCurrentSrc = useCallback(
    (currentSrc: string): void => {
      if (currentSrc === audioRef.current.currentSrc) return;

      audioRef.current.src = currentSrc;
    },
    [audioRef],
  );

  const changeCurrentTime = useCallback(
    (currentTime: number): void => {
      audioRef.current.currentTime = currentTime;
    },
    [audioRef],
  );

  const changePlaybackRange = useCallback(
    (progress: number): void => {
      changeCurrentTime((progress / maxPlaybackRange) * duration);
    },
    [changeCurrentTime, duration, maxPlaybackRange],
  );

  const changeVolume = useCallback(
    (volume: number): void => {
      audioRef.current.volume = volume / maxProgressVolume;
      audioRef.current.muted = volume <= 0;
    },
    [audioRef, maxProgressVolume],
  );

  const pause = useCallback((): void => {
    audioRef.current.pause();
  }, [audioRef]);

  const play = useCallback((): void => {
    audioRef.current.play().catch(() => {
      pause();
    });
  }, [audioRef, pause]);

  const resetAudioTime = useCallback((): void => {
    audioRef.current.currentTime = 0;
  }, [audioRef]);

  const togglePlayPause = useCallback(
    (src?: string): void => {
      if (src && src !== audioRef.current.src) {
        audioRef.current.src = src;
        play();
        return;
      }

      if (isPlaying) {
        pause();
        return;
      }
      play();
    },
    [audioRef, isPlaying, pause, play],
  );

  const toggleMuted = useCallback((): void => {
    audioRef.current.muted = !audioRef.current.muted;
  }, [audioRef]);

  return {
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

export default useControlAudio;
