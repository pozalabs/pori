import { useCallback, useEffect, useState } from 'react';

import fetchAudio from '../../utils/fetchAudio';

interface UseAudioDataParams {
  src: string;
  sampleRate: number;
  peakLength: number;
}

interface UseAudioDataReturns {
  audioUrl: string;
  audioBuffer: AudioBuffer | null;
  peaks: number[];
}

const useAudioData = ({ src, sampleRate, peakLength }: UseAudioDataParams): UseAudioDataReturns => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [peaks, setPeaks] = useState<number[]>([]);
  const [error, setError] = useState<unknown>(null);

  if (error) throw error;

  const normalizePeaks = useCallback((peaks: number[]): number[] => {
    const peak = Math.max(...peaks);
    const multiplier = Math.pow(peak, -1);

    return peaks.map(peak => peak * multiplier);
  }, []);

  const getPeaks = useCallback((): number[] => {
    if (!audioBuffer) return [];

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
  }, [normalizePeaks, peakLength, audioBuffer]);

  const getAudioData = useCallback(
    async (audioContext: AudioContext): Promise<void> => {
      try {
        const { url, arrayBuffer } = await fetchAudio({
          src,
        });
        setAudioUrl(url);

        audioContext.decodeAudioData(arrayBuffer, audioBuffer => {
          setAudioBuffer(audioBuffer);
        });
      } catch (err) {
        setError(err);
      }
    },
    [src],
  );

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate,
    });

    getAudioData(audioContext);

    return () => {
      audioContext.close();
    };
  }, [getAudioData, sampleRate]);

  useEffect(() => {
    if (!audioBuffer) return;

    setPeaks(getPeaks());
  }, [audioBuffer, peakLength, getPeaks]);

  return { audioUrl, audioBuffer, peaks };
};

export default useAudioData;
