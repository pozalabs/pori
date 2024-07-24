import { useEffect, useRef } from 'react';
import useWaveform, { type UseWaveformParams } from '../../hooks/useWaveform';

const Waveform = (props: UseWaveformParams) => {
  const { waveform } = useWaveform(props);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !waveform) return;

    if (!containerRef.current.hasChildNodes()) {
      containerRef.current.appendChild(waveform as Node);
      return;
    }

    const waveformElement = waveform as Element;
    waveformElement.setAttribute('role', 'waveform');

    containerRef.current.replaceChild(waveformElement, containerRef.current.firstChild!);
  }, [waveform]);

  return <div ref={containerRef} className="w-max h-max" />;
};

export default Waveform;
