import { useWaveform } from '../../hooks';
import { useEffect, useRef } from 'react';

interface WaveformProps {
  src: string;
  type?: 'canvas' | 'svg';
  sampleRate?: number;
  peakLength?: number;
}

const Waveform = ({ src, type, sampleRate, peakLength }: WaveformProps) => {
  const { waveform } = useWaveform({ src, type, sampleRate, peakLength });

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
