import { useMemo } from 'react';
import { BAR_WIDTH } from './_constants';

interface UseWaveformSizeParams {
  width: number;
  height: number;
  peakLength: number;
  currentTime: number;
  duration: number;
}

interface UseWaveformSizeReturns {
  halfHeight: number;
  halfBarOffset: number;
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
  const halfBarOffset = useMemo(() => BAR_WIDTH / 2, []);
  const playedWidth = useMemo(() => {
    const playedWidth = Math.round((currentTime / duration) * width);
    return isNaN(playedWidth) ? 0 : Math.min(width, playedWidth);
  }, [currentTime, duration, width]);

  return {
    halfHeight,
    halfBarOffset,
    playedWidth,
  };
};

export default useWaveformSize;
