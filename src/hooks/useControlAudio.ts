'use client';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';

interface UseControlAudioParams {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  src?: string;
  autoPlay?: boolean;
}

interface IAudioState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  currentSrc?: string;
}

interface IAudioController {
  play: VoidFunction;
  pause: VoidFunction;
  togglePlay: (newCurrentSrc?: string) => void;
  changeCurrentSrc: (newCurrentSrc: string) => void;
  changeCurrentTime: (newCurrentTime: number) => void;
}

/**
 * audio를 제어하는 hook입니다.
 * @param param
 * ```typescript
 * interface UseControlAudioParams {
 *  audioRef: MutableRefObject<HTMLAudioElement | null>;
 *  src?: string;
 *  autoPlay?: boolean; // default: false
 * }
 * ```
 * - `audioRef` : 제어할 오디오 ref
 * - `src` : 재생할 음원 url
 * - `autoPlay` : 자동 재생 여부
 * @returns
 * ```typescript
 * interface IAudioState {
 *   isPlaying: boolean;
 *   duration: number;
 *   currentTime: number;
 *   currentSrc?: string;
 * };
 * interface IAudioController {
 *   play: VoidFunction;
 *   pause: VoidFunction;
 *   togglePlay: (src?: string) => void;
 *   changeCurrentSrc: (newCurrentSrc: string) => void;
 *   changeCurrentTime: (newCurrentTime: number) => void;
 * };
 * ```
 * - state (readonly)
 *   - `isPlaying` : 현재 오디오가 재생 중인지 여부
 *   - `duration` : 현재 오디오에 있는 음원의 길이 (초 단위)
 *   - `currentTime` : 현재 오디오에서 재생 중인 시간 (초 단위)
 *   - `currentSrc` : 현재 오디오에 있는 음원의 url
 * - controller
 *   - `play` : 오디오 재생
 *   - `pause` : 오디오 일시정지
 *   - `togglePlay` : 오디오를 재생 또는 일시정지 하거나, 새로운 음원을 처음부터 재생
 *   - `changeCurrentSrc` : 오디오 src를 바꾸는 함수
 *   - `changeCurrentTime` : 현재 오디오 재생 시간을 바꾸는 함수
 */
export const useControlAudio = ({
  audioRef,
  src,
  autoPlay = false,
}: UseControlAudioParams): [Readonly<IAudioState>, IAudioController] => {
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
      setCurrentSrc(audioRef.current.src);
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

  const audioState: Readonly<IAudioState> = {
    isPlaying,
    duration,
    currentTime,
    currentSrc,
  };
  const audioController: IAudioController = {
    play: onPlay,
    pause: onPause,
    togglePlay,
    changeCurrentSrc,
    changeCurrentTime,
  };

  return [audioState, audioController] as const;
};
