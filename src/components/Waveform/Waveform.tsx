import { useWaveform } from '../../hooks';
import { useEffect, useRef } from 'react';

interface WaveformProps {
  src: string;
  type?: 'canvas' | 'svg';
  sampleRate?: number;
  peakLength?: number;
  width?: number;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  bgColor?: string;
}

const Waveform = (props: WaveformProps) => {
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

    containerRef.current.replaceChild(
      waveformElement,
      containerRef.current.firstChild!,
    );
  }, [waveform]);

  return <div ref={containerRef} className="w-max h-max" />;
};

export default Waveform;
