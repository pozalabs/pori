import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import useWaveform, {
  type UseWaveformParams,
} from '../../hooks/waveform/useWaveform';

const Waveform = forwardRef((props: UseWaveformParams, ref) => {
  const {
    waveform,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    changeCurrentTime,
  } = useWaveform(props);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !waveform) return;

    if (!containerRef.current.hasChildNodes()) {
      containerRef.current.appendChild(waveform as Node);
      return;
    }

    const waveformElement = waveform as Element;
    waveformElement.setAttribute('role', 'waveform');

    containerRef.current.replaceChild(
      waveformElement,
      containerRef.current.firstChild!,
    );
  }, [waveform]);

  useImperativeHandle(
    ref,
    () => ({
      isPlaying,
      currentTime,
      duration,
      play,
      pause,
      changeCurrentTime,
    }),
    [isPlaying, currentTime, duration],
  );

  return <div ref={containerRef} className="w-max h-max" />;
});

export default Waveform;
