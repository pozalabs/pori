import { useCallback, useEffect, useRef, useState } from 'react';

import { useAudio, useControlAudio } from '@pozalabs/pokit';

import type { HTMLAudioElementEventType, UnionToIntersection } from './_types';

interface UseWaveformAudioParams extends HTMLAudioElementEventType {
  src: string;
  autoplay: boolean;
}

interface UseWaveformAudioReturns {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  changeCurrentTime: (currentTime: number) => void;
}

const useWaveformAudio = ({
  src,
  autoplay,
  ...eventHandlers
}: UseWaveformAudioParams): UseWaveformAudioReturns => {
  const [currentTime, setCurrentTime] = useState(0);
  const currentTimeRafId = useRef(0);

  const audioRef = useAudio();
  const [{ isPlaying, duration }, { play, pause }] = useControlAudio({
    audioRef,
    src,
    autoPlay: autoplay,
  });

  const changeCurrentTime = useCallback(
    (currentTime: number): void => {
      if (!audioRef.current) return;

      setCurrentTime(currentTime);
      audioRef.current.currentTime = currentTime;
    },
    [audioRef],
  );

  useEffect(() => {
    if (!audioRef.current) return;

    Object.keys(eventHandlers).forEach(eventType => {
      const eventHandler = convertReactHandlerToNativeHandler(
        eventHandlers[eventType as keyof HTMLAudioElementEventType],
      );

      if (!eventHandler) return;

      const formattedEventType = eventType
        .slice(2)
        .toLocaleLowerCase() as keyof HTMLMediaElementEventMap;

      audioRef.current?.addEventListener(formattedEventType, eventHandler);
    });
  }, [audioRef, eventHandlers]);

  useEffect(() => {
    const updateCurrentTime = () => {
      if (!isPlaying) return;

      const newCurrentTime = Number((audioRef.current?.currentTime ?? 0).toFixed(2));

      setCurrentTime(newCurrentTime);
      currentTimeRafId.current = requestAnimationFrame(updateCurrentTime);
    };

    if (isPlaying) {
      currentTimeRafId.current = requestAnimationFrame(updateCurrentTime);
      return;
    }
    cancelAnimationFrame(currentTimeRafId.current);

    return () => {
      cancelAnimationFrame(currentTimeRafId.current);
    };
  }, [audioRef, isPlaying]);

  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    changeCurrentTime,
  };
};

const convertReactHandlerToNativeHandler = (
  handler: HTMLAudioElementEventType[keyof HTMLAudioElementEventType],
) => {
  if (!handler) return;

  type HandlerParam = UnionToIntersection<Parameters<typeof handler>[0]>;

  return (event: Event) => {
    handler(event as unknown as HandlerParam);
  };
};

export default useWaveformAudio;
