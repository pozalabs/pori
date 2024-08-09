import { BAR_WIDTH } from '../_constants';

const getPeakLength = (width: number, gap: number): number => {
  const peakLength = Math.floor(width / (gap + BAR_WIDTH));

  return peakLength;
};

export default getPeakLength;
