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
  playedIndex: number;
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
  const playedWidth = useMemo(
    () => (currentTime / duration) * width,
    [currentTime, duration, width],
  );
  const playedIndex = useMemo(
    () => Math.floor(playedWidth / barIndexScale),
    [playedWidth, barIndexScale],
  );

  return {
    halfHeight,
    barIndexScale,
    playedIndex,
  };
};

export default useWaveformSize;
