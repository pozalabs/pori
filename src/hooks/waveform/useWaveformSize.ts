import { useMemo } from 'react';

interface UseWaveformSizeParams {
  width: number;
  height: number;
  peakLength: number;
  currentTime: number;
  duration: number;
}

interface UseWaveformSizeReturns {
  halfHeight: number;
  barIndexScale: number;
  playedWidth: number;
}

const useWaveformSize = ({
  width,
  height,
  peakLength,
  currentTime,
  duration,
}: UseWaveformSizeParams): UseWaveformSizeReturns => {
  const halfHeight = useMemo(() => height / 2, [height]);
  const barIndexScale = useMemo(() => width / peakLength, [width, peakLength]);
  const playedWidth = useMemo(() => {
    const playedWidth = Math.round((currentTime / duration) * width);
    return isNaN(playedWidth) ? 0 : Math.min(width, playedWidth);
  }, [currentTime, duration, width]);

  return {
    halfHeight,
    barIndexScale,
    playedWidth,
  };
};

export default useWaveformSize;
