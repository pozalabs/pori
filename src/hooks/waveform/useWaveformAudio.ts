import { useEffect } from 'react';

import useAudio from '../useAudio';
import useControlAudio from '../useControlAudio';

import { HTMLAudioElementEventType, UnionToIntersection } from './_types';

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
  const audioRef = useAudio();
  const { isPlaying, currentTime, duration, play, pause, changeCurrentTime } = useControlAudio({
    audioRef,
    src,
    autoPlay: autoplay,
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
  }, []);

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
