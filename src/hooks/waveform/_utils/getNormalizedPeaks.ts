const upsamplePeaks = (peaks: number[], peakLength: number): number[] => {
  const scaleFactor = (peaks.length - 1) / (peakLength - 1);

  const result = [...Array(peakLength).keys()].reduce<number[]>((acc, peakIndex) => {
    const position = peakIndex * scaleFactor;
    const leftIndex = Math.floor(position);
    const rightIndex = Math.min(leftIndex + 1, peaks.length - 1);

    const interpolationRatio = position - leftIndex;
    const interpolatedValue =
      peaks[leftIndex] * (1 - interpolationRatio) + peaks[rightIndex] * interpolationRatio;

    return [...acc, interpolatedValue];
  }, []);

  return result;
};

const downsamplePeaks = (peaks: number[], peakLength: number): number[] => {
  const sampleSize = peaks.length / peakLength;

  const result = [...Array(peakLength).keys()].reduce<number[]>((acc, peakIndex) => {
    const samples = peaks.slice(
      Math.floor(peakIndex * sampleSize),
      Math.min(Math.ceil((peakIndex + 1) * sampleSize), peaks.length),
    );
    const max = samples.reduce((prevMax, sample) => {
      if (Math.abs(sample) > Math.abs(prevMax)) return Math.abs(sample);
      return prevMax;
    }, 0);

    return [...acc, max];
  }, []);

  return result;
};

const getNormalizedPeaks = (peaks: number[], peakLength: number): number[] => {
  if (peakLength === peaks.length) {
    return peaks;
  }

  if (peakLength > peaks.length) {
    return upsamplePeaks(peaks, peakLength);
  }

  return downsamplePeaks(peaks, peakLength);
};

export default getNormalizedPeaks;
