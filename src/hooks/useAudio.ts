'use client';
import type { MutableRefObject } from 'react';
import { useEffect, useRef } from 'react';

/**
 * useRef를 통해, 화면에 나타나지 않는 audio element를 생성합니다.
 * @returns 재생할 audio element 혹은 null
 */

export const useAudio = (): MutableRefObject<HTMLAudioElement | null> => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      audioRef.current = null;
    };
  }, []);

  return audioRef;
};
