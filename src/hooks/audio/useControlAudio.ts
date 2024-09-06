import type { MutableRefObject } from 'react';
import { useCallback } from 'react';

interface UseControlAudioParams {
  audioRef: MutableRefObject<HTMLAudioElement>;
  maxProgressTime: number;
  maxProgressVolume: number;
  duration: number;
  isPlaying: boolean;
  timeShift: number;
}

export interface UseControlAudioReturns {
  changeCurrentSrc: (currentSrc: string) => void;
  changeCurrentTime: (currentTime: number) => void;
  changeMuted: (muted: boolean) => void;
  changePlaybackRate: (playbackRate: number) => void;
  changeProgressTime: (progress: number) => void;
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

const useControlAudio = ({
  audioRef,
  maxProgressTime,
  maxProgressVolume,
  duration,
  isPlaying,
  timeShift,
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

  const changeMuted = useCallback(
    (muted: boolean): void => {
      audioRef.current.muted = muted;
    },
    [audioRef],
  );

  const changePlaybackRate = useCallback(
    (playbackRate: number): void => {
      audioRef.current.playbackRate = playbackRate;
    },
    [audioRef],
  );

  const changeProgressTime = useCallback(
    (progress: number): void => {
      changeCurrentTime((progress / maxProgressTime) * duration);
    },
    [changeCurrentTime, duration, maxProgressTime],
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

  const resetAudio = useCallback((): void => {
    audioRef.current.pause();
    audioRef.current.src = 'data:,';
    audioRef.current.muted = false;
    audioRef.current.volume = 1;
    audioRef.current.playbackRate = 1;
  }, [audioRef]);

  const resetAudioTime = useCallback((): void => {
    audioRef.current.currentTime = 0;
  }, [audioRef]);

  const shiftTimeBackward = useCallback((): void => {
    if (isNaN(audioRef.current.duration)) return;

    const currentTime = audioRef.current.currentTime + timeShift;

    changeCurrentTime(Math.min(currentTime, audioRef.current.duration));
  }, [audioRef, changeCurrentTime, timeShift]);

  const shiftTimeForward = useCallback((): void => {
    if (isNaN(audioRef.current.duration)) return;

    const currentTime = audioRef.current.currentTime - timeShift;

    changeCurrentTime(Math.max(currentTime, 0));
  }, [audioRef, changeCurrentTime, timeShift]);

  const stop = useCallback((): void => {
    pause();
    resetAudioTime();
  }, [pause, resetAudioTime]);

  const toggleMuted = useCallback((): void => {
    audioRef.current.muted = !audioRef.current.muted;
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

  return {
    changeCurrentSrc,
    changeCurrentTime,
    changeMuted,
    changePlaybackRate,
    changeProgressTime,
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

export default useControlAudio;
