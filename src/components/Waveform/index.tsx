import type { ForwardedRef } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import useWaveform from '../../hooks/waveform/useWaveform';
import type { UseWaveformParams, WaveformHandles, WaveformType } from '../../types';

/**
 * Renders a waveform powered by the useWaveform hook.
 *
 * Use the ref to access and control audio state.
 *
 * Note: The ref exposes a snapshot of the audio state, not a live-updating value.
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
