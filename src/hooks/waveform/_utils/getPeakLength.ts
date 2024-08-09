import { BAR_WIDTH } from '../_constants';

const getPeakLength = (width: number, gap: number): number => {
  const processedGap = gap >= 0 ? gap : 0;

  const peakLength = Math.floor(width / (processedGap + BAR_WIDTH));

  return peakLength;
};

export default getPeakLength;
