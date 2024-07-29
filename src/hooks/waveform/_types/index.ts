import { UseWaveformParams } from '../useWaveform';

export interface UseTypeWaveformParams
  extends Required<
    Omit<UseWaveformParams, 'src' | 'type' | 'sampleRate' | 'peakLength' | 'autoplay'>
  > {
  peaks: number[];
  currentTime: number;
  duration: number;
  changeCurrentTime?: (currentTime: number) => void;
  enabled: boolean;
}
