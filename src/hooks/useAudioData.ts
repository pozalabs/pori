import { useCallback, useEffect, useState } from 'react';

import fetchAudio from '../utils/fetchAudio';

interface UseAudioDataParams {
  src: string;
  sampleRate: number;
  peakLength: number;
}

const useAudioData = ({ src, sampleRate, peakLength }: UseAudioDataParams) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [error, setError] = useState<unknown>(null);

  if (error) throw error;

  const normalizePeaks = useCallback((peaks: number[]): number[] => {
    const peak = Math.max(...peaks);
    const multiplier = Math.pow(peak, -1);

    return peaks.map(peak => peak * multiplier);
  }, []);

  const getPeaks = useCallback(
    (audioBuffer: AudioBuffer): number[] => {
      const channelData = audioBuffer.getChannelData(0);
      const sampleSize = Math.floor(channelData.length / peakLength);

      const peaks = [...Array(peakLength).keys()].reduce<number[]>((acc, peakIndex) => {
        const samples = channelData.slice(
          Math.floor(peakIndex * sampleSize),
          Math.ceil((peakIndex + 1) * sampleSize),
        );
        const max = samples.reduce((prevMax, sample) => {
          if (Math.abs(sample) > Math.abs(prevMax)) return Math.abs(sample);
          return prevMax;
        }, 0);

        return [...acc, max];
      }, []);

      return normalizePeaks(peaks);
    },
    [normalizePeaks, peakLength],
  );

  const initPeaks = useCallback(
    async (audioContext: AudioContext): Promise<void> => {
      try {
        const arrayBuffer = await fetchAudio<ArrayBuffer>({
          src,
          type: 'arrayBuffer',
        });
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        setAudioBuffer(audioBuffer);
        setPeaks(getPeaks(audioBuffer));
      } catch (err) {
        setError(err);
      }
    },
    [getPeaks, src],
  );

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate,
    });

    initPeaks(audioContext);

    return () => {
      audioContext.close();
    };
  }, [sampleRate]);

  return { audioBuffer, peaks };
};

export default useAudioData;
