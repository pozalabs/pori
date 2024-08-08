import { ChangeEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from '@pozalabs/pokit/hooks'

interface UseControlAudioTimeParams {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  progressMaxValue: number;
  dragMode?: boolean;
}

interface UseControlAudioTimeReturns {
  currentTime: number;
  progress: number;
  dragTime: number;
  onProgressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  changeProgressByValue: (value: number) => void;
  setDragModeRef: (dragMode: boolean) => void;
  resetAudioTime: () => void;
}

/**
 * audio 시간을 제어하는 hook입니다.
 * @param UseControlAudioTimeParams
 * ```
 * interface UseControlAudioTimeParams {
 *   audioRef: MutableRefObject<HTMLAudioElement | null>;
 *   progressMaxValue: number;
 *   dragMode?: boolean;
 * }
 * ```
 * - dragMode default : `false`
 * @returns
 * `UseControlAudioTimeReturns`
 * ```
 * interface UseControlAudioTimeReturns {
 *   currentTime: number;
 *   progress: number;
 *   dragTime: number;
 *   onProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 *   changeProgressByValue: (value: number) => void;
 *   setDragModeRef: (dragMode: boolean) => void;
 *   resetAudioTime: () => void;
 * }
 * ```
 */

const useControlAudioTime = ({
  audioRef,
  progressMaxValue,
  dragMode = false,
}: UseControlAudioTimeParams): UseControlAudioTimeReturns => {
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragTime, setDragTime] = useState(0);

  const dragModeRef = useRef(dragMode);

  const setDragModeRef = (dragMode: boolean): void => {
    dragModeRef.current = dragMode;
  }

  const getProgress = useCallback((duration: number, currentTime: number): number => {
    return duration > 0 ? (currentTime / duration) * progressMaxValue : 0;
  }, [progressMaxValue]);

  const updateProgress = useCallback((): void => {
    if (!audioRef.current || !audioRef.current.src || !audioRef.current.duration || dragModeRef.current) return;

    const audio = audioRef.current;

    setCurrentTime(audio.currentTime);
    setProgress(getProgress(audio.duration, audio.currentTime));
  }, [audioRef.current, audioRef.current?.duration, audioRef.current?.src, audioRef.current?.currentTime, dragModeRef.current]);

  const resetAudioTime = useCallback((): void => {
    setDragTime(0);
    setCurrentTime(0);
    setProgress(0);
  }, []);

  const onProgressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      if (!audioRef.current || !audioRef.current.src || !audioRef.current.duration) return;

      const newProgress = Number(e.target.value);
      setProgress(newProgress);

      if (dragModeRef.current) {
        setDragTime((newProgress / progressMaxValue) * audioRef.current.duration);
        return;
      }

      audioRef.current.currentTime = (newProgress / progressMaxValue) * audioRef.current.duration;
    },
    [audioRef.current, dragModeRef.current, progressMaxValue],
  );

  const changeProgressByValue = useCallback(
    (value: number): void => {
      if (!audioRef.current || !audioRef.current.src || !audioRef.current.duration) return;

      setProgress(value);

      if (dragModeRef.current) {
        setDragTime((value / progressMaxValue) * audioRef.current.duration);
        return;
      }

      audioRef.current.currentTime = (value / progressMaxValue) * audioRef.current.duration;
    },
    [audioRef.current, progressMaxValue],
  );

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("loadedmetadata", resetAudioTime);
    audioRef.current.addEventListener("timeupdate", updateProgress);

    return () => {
      if (!audioRef.current) return;

      audioRef.current.removeEventListener("loadedmetadata", resetAudioTime);
      audioRef.current.removeEventListener("timeupdate", updateProgress);
    };
  }, [audioRef.current, resetAudioTime, updateProgress]);

  useEffect(() => {
    if (!audioRef.current || !audioRef.current.paused) return;

    setCurrentTime(audioRef.current.currentTime);
    setProgress(getProgress(audioRef.current.duration, audioRef.current.currentTime));
  }, [audioRef.current?.currentTime]);

  useIsomorphicLayoutEffect(() => {
    if (!audioRef.current || dragModeRef.current || !(audioRef.current.readyState >= audioRef.current.HAVE_CURRENT_DATA)) return;

    audioRef.current.currentTime = dragTime;
    setCurrentTime(dragTime);
  }, [dragModeRef.current, dragTime]);

  return {
    progress,
    currentTime,
    dragTime,
    onProgressChange,
    changeProgressByValue,
    setDragModeRef,
    resetAudioTime,
  };
};

export default useControlAudioTime;

