import type { ForwardedRef, RefObject } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { WaveformType } from '../../hooks/waveform/_types';
import useWaveform, { type UseWaveformParams } from '../../hooks/waveform/useWaveform';

export interface WaveformHandles {
  waveformRef: RefObject<HTMLDivElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  changeCurrentTime: (currentTime: number) => void;
}

/**
 * useWaveform 훅을 사용하여 렌더링하는 Waveform 컴포넌트입니다.
 *
 * 전달하는 ref를 통해 오디오에 대한 정보를 얻거나 제어할 수 있습니다.
 *
 * (주의: 전달하는 오디오 상태는 ref를 사용하기 때문에 실시간으로 바뀌지 않습니다. 필요할 때 접근해서 사용해주세요.)
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
