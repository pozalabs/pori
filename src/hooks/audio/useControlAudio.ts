import type { MutableRefObject } from 'react';
import { useCallback } from 'react';

import Hls from 'hls.js';

import type { UseControlAudioReturns } from '../../types';

interface UseControlAudioParams {
  hlsRef: MutableRefObject<Hls | null>;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  maxPlaybackRange: number;
  maxVolume: number;
  duration: number;
  isPlaying: boolean;
  timeShift: number;
}

const useControlAudio = ({
  hlsRef,
  audioRef,
  maxPlaybackRange,
  maxVolume,
  duration,
  isPlaying,
  timeShift,
}: UseControlAudioParams): UseControlAudioReturns => {
  const changeCurrentSrc = useCallback(
    (currentSrc: string): void => {
      const audio = audioRef.current;
      if (!audio) return;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const absoluteCurrentSrc = new URL(currentSrc, window.location.href).href;
      if (absoluteCurrentSrc === audio.currentSrc) return;
      const playbackRate = audio.playbackRate;
      audio.playbackRate = playbackRate;

      if (currentSrc.substring(currentSrc.lastIndexOf('.') + 1) === 'm3u8' && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentSrc);
        hls.attachMedia(audio);
        hlsRef.current = hls;
      } else {
        audio.src = currentSrc;
      }
    },
    [audioRef, hlsRef],
  );

  const changeCurrentTime = useCallback(
    (currentTime: number): void => {
      if (!audioRef.current) return;

      audioRef.current.currentTime = currentTime;
    },
    [audioRef],
  );

  const changeMuted = useCallback(
    (muted: boolean): void => {
      if (!audioRef.current) return;

      audioRef.current.muted = muted;
    },
    [audioRef],
  );

  const changePlaybackRate = useCallback(
    (playbackRate: number): void => {
      if (!audioRef.current) return;

      audioRef.current.playbackRate = playbackRate;
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
      if (!audioRef.current) return;

      audioRef.current.volume = volume / maxVolume;
      audioRef.current.muted = volume <= 0;
    },
    [audioRef, maxVolume],
  );

  const pause = useCallback((): void => {
    if (!audioRef.current) return;

    audioRef.current.pause();
  }, [audioRef]);

  const play = useCallback((): void => {
    if (!audioRef.current) return;

    audioRef.current.play().catch(() => {
      pause();
    });
  }, [audioRef, pause]);

  const resetAudio = useCallback((): void => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.src = '';
    audio.muted = false;
    audio.volume = 1;
    audio.playbackRate = 1;
  }, [audioRef]);

  const resetAudioTime = useCallback((): void => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
  }, [audioRef]);

  const shiftTimeBackward = useCallback((): void => {
    const audio = audioRef.current;

    if (!audio || isNaN(audio.duration)) return;

    const currentTime = audio.currentTime + timeShift;

    changeCurrentTime(Math.min(currentTime, audio.duration));
  }, [audioRef, changeCurrentTime, timeShift]);

  const shiftTimeForward = useCallback((): void => {
    const audio = audioRef.current;

    if (!audio || isNaN(audio.duration)) return;

    const currentTime = audio.currentTime - timeShift;

    changeCurrentTime(Math.max(currentTime, 0));
  }, [audioRef, changeCurrentTime, timeShift]);

  const stop = useCallback((): void => {
    pause();
    resetAudioTime();
  }, [pause, resetAudioTime]);

  const toggleMuted = useCallback((): void => {
    if (!audioRef.current) return;

    audioRef.current.muted = !audioRef.current.muted;
  }, [audioRef]);

  const togglePlayPause = useCallback(
    (src?: string): void => {
      if (!audioRef.current) return;

      if (src) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }

        if (src.substring(src.lastIndexOf('.') + 1) === 'm3u8' && Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(audioRef.current);
          hlsRef.current = hls;
        } else {
          audioRef.current.src = src;
        }

        play();
        return;
      }

      if (isPlaying) {
        pause();
        return;
      }
      play();
    },
    [audioRef, isPlaying, pause, play, hlsRef],
  );

  return {
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

export default useControlAudio;
