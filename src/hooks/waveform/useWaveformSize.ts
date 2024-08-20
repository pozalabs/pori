import { useMemo } from 'react';

import { BAR_WIDTH, WAVEFORM_HEIGHT_RATIO } from './_constants';

interface UseWaveformSizeParams {
  width: number;
  height: number;
  currentTime: number;
  duration: number;
}

interface UseWaveformSizeReturns {
  halfHeight: number;
  maxHeight: number;
  halfBarOffset: number;
  playedWidth: number;
}

const useWaveformSize = ({
  width,
  height,
  currentTime,
  duration,
}: UseWaveformSizeParams): UseWaveformSizeReturns => {
  const halfHeight = useMemo(() => height / 2, [height]);
  const maxHeight = useMemo(() => height * WAVEFORM_HEIGHT_RATIO, [height]);
  const halfBarOffset = useMemo(() => BAR_WIDTH / 2, []);
  const playedWidth = useMemo(() => {
    const playedWidth = Math.round((currentTime / duration) * width);
    return isNaN(playedWidth) ? 0 : Math.min(width, playedWidth);
  }, [currentTime, duration, width]);

  return {
    halfHeight,
    maxHeight,
    halfBarOffset,
    playedWidth,
  };
};

export default useWaveformSize;
