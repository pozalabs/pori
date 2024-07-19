import { useCallback, useRef } from 'react';

interface SvgWaveformProps {
  peaks: number[];
}

const SvgWaveform = ({ peaks }: SvgWaveformProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const renderWaveform = useCallback(
    (peaks: number[]): JSX.Element | undefined => {
      if (!svgRef.current) return;

      const { clientWidth: width, clientHeight: height } = svgRef.current;

      const halfHeight = height / 2;
      const barIndexScale = width / peaks.length;

      const points = peaks
        .map((peak, index) => {
          const x = Math.round(index * barIndexScale);
          const barHeight = Math.round(peak * halfHeight);
          const yTop = halfHeight - barHeight;
          const yBottom = halfHeight + barHeight;

          return `${x},${yTop} ${x},${yBottom}`;
        })
        .join(' ');

      return <polyline points={points} className="fill-none stroke-1 stroke-black" />;
    },
    [peaks],
  );

  return (
    <svg className="w-full h-full" ref={svgRef}>
      {renderWaveform(peaks)}
    </svg>
  );
};

export default SvgWaveform;
