import { useEffect } from 'react';

import type { HTMLAudioElementEventType, UnionToIntersection } from './_types';
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
