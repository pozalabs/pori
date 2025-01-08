import type { ForwardedRef } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { WaveformType } from '../../hooks/waveform/_types';
import useWaveform, { type UseWaveformParams } from '../../hooks/waveform/useWaveform';
import type { WaveformHandles } from '../../types';

/**
 * This is the Waveform component rendered using the useWaveform hook.
 *
 * You can obtain or control the audio information through the ref passed to the component.
 *
 * (Note: The audio state passed through the ref does not update in real-time. Please access and use it when needed.)
 * ```ts
 * interface WaveformHandles {
 *    isPlaying: boolean;
 *    currentTime: number;
 *    duration: number;
 *    play: () => void;
 *    pause: () => void;
 *    changeCurrentTime: (currentTime: number) => void;
 * }
 * ```
 */
const Waveform = forwardRef(
  <T extends WaveformType>(props: UseWaveformParams<T>, ref: ForwardedRef<WaveformHandles>) => {
    const { waveform, isPlaying, currentTime, duration, play, pause, changeCurrentTime } =
      useWaveform(props);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current || !waveform) return;

      const waveformElement = waveform as Element;

      if (!containerRef.current.hasChildNodes()) {
        containerRef.current.appendChild(waveform);
        return;
      }

      containerRef.current.replaceChild(waveformElement, containerRef.current.firstChild!);
    }, [waveform]);

    useImperativeHandle(
      ref,
      () => ({
        waveformRef: containerRef,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        changeCurrentTime,
      }),
      [containerRef, isPlaying, currentTime, duration, play, pause, changeCurrentTime],
    );

    return <div ref={containerRef} className="size-max" />;
  },
);

Waveform.displayName = 'Waveform';
export default Waveform;
