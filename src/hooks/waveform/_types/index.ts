import { DOMAttributes } from 'react';

import { UseWaveformParams } from '../useWaveform';

export interface UseTypeWaveformParams
  extends Required<
    Pick<
      UseWaveformParams,
      | 'variant'
      | 'width'
      | 'height'
      | 'playheadWidth'
      | 'waveColor'
      | 'progressColor'
      | 'bgColor'
      | 'playheadColor'
      | 'className'
      | 'controls'
      | 'playhead'
    >
  > {
  peaks: number[];
  currentTime: number;
  duration: number;
  changeCurrentTime?: (currentTime: number) => void;
  enabled: boolean;
}

export type UnionToIntersection<U> = (
  U extends any ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

export type HTMLAudioElementEventType = Omit<
  DOMAttributes<HTMLAudioElement>,
  'children' | 'dangerouslySetInnerHTML'
>;
