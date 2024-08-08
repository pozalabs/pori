import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';

interface UseControlAudioParams {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  src?: string;
  autoPlay?: boolean;
}

interface UseControlAudioReturns {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  currentSrc?: string;
  play: VoidFunction;
  pause: VoidFunction;
  togglePlay: (newCurrentSrc?: string) => void;
  changeCurrentSrc: (newCurrentSrc: string) => void;
  changeCurrentTime: (newCurrentTime: number) => void;
}

/**
 * audio 재생을 제어하는 hook입니다.
 * @param UseControlAudioParams
 * ```typescript
 * interface UseControlAudioParams {
 *   audioRef: MutableRefObject<HTMLAudioElement | null>;
 *   src?: string;
 *   autoPlay?: boolean;
 * }
 * ```
 * - autoPlay default : `false`
 * @returns
 * `UseControlAudioReturns`
 * ```typescript
 * interface UseControlAudioReturns {
 *   isPlaying: boolean;
 *   duration: number;
 *   currentTime: number;
 *   currentSrc?: string;
 *   play: VoidFunction;
 *   pause: VoidFunction;
 *   togglePlay: (src?: string) => void;
 *   changeCurrentSrc: (newCurrentSrc: string) => void;
 *   changeCurrentTime: (newCurrentTime: number) => void;
 * }
 * ```
 */
const useControlAudio = ({
  audioRef,
  src,
  autoPlay = false,
}: UseControlAudioParams): UseControlAudioReturns => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [currentTime, setCurrentTime] = useState(0);

  const onMetadataLoaded = useCallback(() => {
    if (!audioRef?.current) return;

    setDuration(Math.floor(audioRef.current.duration));
    setCurrentSrc(src);
    setCurrentTime(0);
    setIsPlaying(!audioRef.current.paused);
  }, [audioRef]);

  const onAudioEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onAudioPlay = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);
  }, [isPlaying]);

  const onAudioPause = useCallback(() => {
    if (!isPlaying) return;

    setIsPlaying(false);
  }, [isPlaying]);

  const onAudioTimeUpdate = useCallback(
    (e: Event) => {
      const newCurrentTime =
        (e.target as HTMLAudioElement).currentTime ?? audioRef.current?.currentTime;

      setCurrentTime(newCurrentTime);
    },
    [audioRef],
  );

  const onPlay = useCallback(() => {
    if (!audioRef?.current || !audioRef.current.paused || !audioRef.current.src) return;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        onAudioEnd();
      });
  }, [audioRef, onAudioEnd]);

  const onPause = useCallback(() => {
    if (!audioRef?.current || !audioRef.current.src) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }, [audioRef]);

  const togglePlay = useCallback(
    (src?: string) => {
      if (!audioRef?.current) return;

      if (src && audioRef.current.src !== src) {
        audioRef.current.src = src;
        setCurrentSrc(audioRef.current.src);
      }

      if (!audioRef.current.paused) {
        onPause();
        return;
      }

      onPlay();
    },
    [audioRef, onPause, onPlay],
  );

  const changeCurrentSrc = useCallback(
    (newCurrentSrc: string) => {
      if (!audioRef?.current) return;

      audioRef.current.src = newCurrentSrc;
      setCurrentSrc(newCurrentSrc);
    },
    [audioRef],
  );

  const changeCurrentTime = useCallback(
    (newCurrentTime: number) => {
      if (!audioRef?.current) return;

      audioRef.current.currentTime = newCurrentTime;
      setCurrentTime(audioRef.current.currentTime);
    },
    [audioRef],
  );

  useEffect(() => {
    if (!audioRef?.current || !src) return;

    audioRef.current.src = src;
  }, [audioRef, src]);

  useEffect(() => {
    if (!audioRef?.current) return;

    const audio = audioRef.current;
    audio.autoplay = autoPlay;
    audio.addEventListener('loadedmetadata', onMetadataLoaded);
    audio.addEventListener('play', onAudioPlay);
    audio.addEventListener('pause', onAudioPause);
    audio.addEventListener('ended', onAudioEnd);
    audio.addEventListener('timeupdate', onAudioTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', onMetadataLoaded);
      audio.removeEventListener('play', onAudioPlay);
      audio.removeEventListener('pause', onAudioPause);
      audio.removeEventListener('ended', onAudioEnd);
      audio.removeEventListener('timeupdate', onAudioTimeUpdate);
    };
  }, [
    audioRef,
    onMetadataLoaded,
    onAudioPlay,
    onAudioPause,
    onAudioEnd,
    onAudioTimeUpdate,
    autoPlay,
  ]);

  return {
    isPlaying,
    duration,
    currentTime,
    currentSrc,
    play: onPlay,
    pause: onPause,
    togglePlay,
    changeCurrentSrc,
    changeCurrentTime,
  };
};

export default useControlAudio;
