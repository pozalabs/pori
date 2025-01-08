import { useEffect } from 'react';

import type { UnionToIntersection } from './_types';
import type { HTMLAudioElementEventType } from '../../types';
import useAudio from '../audio/useAudio';

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
  const { audioRef, currentTime, isPlaying, duration, play, pause, changeCurrentTime } = useAudio({
    src,
    autoplay,
  });

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const events = Object.keys(eventHandlers).reduce<
      { [key: string]: (event: Event) => void } | undefined
    >((acc, eventType) => {
      const eventHandler = convertReactHandlerToNativeHandler(
        eventHandlers[eventType as keyof HTMLAudioElementEventType],
      );

      if (!eventHandler) return;

      const formattedEventType = eventType
        .slice(2)
        .toLocaleLowerCase() as keyof HTMLMediaElementEventMap;

      audio.addEventListener(formattedEventType, eventHandler);

      return { ...acc, [formattedEventType]: eventHandler };
    }, {});

    return () => {
      if (!events) return;

      Object.keys(events).forEach(eventType => {
        audio.removeEventListener(eventType, events[eventType]);
      });
    };
  }, [audioRef, eventHandlers]);

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
