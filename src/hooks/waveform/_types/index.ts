import { DOMAttributes } from 'react';

import { UseWaveformParams } from '../useWaveform';

export interface UseTypeWaveformParams
  extends Required<
    Pick<
      UseWaveformParams,
      | 'variant'
      | 'width'
      | 'height'
      | 'gap'
      | 'playheadWidth'
      | 'waveColor'
      | 'progressColor'
      | 'bgColor'
      | 'playheadBgColor'
      | 'playheadTextColor'
      | 'className'
      | 'controls'
    >
  > {
  enabled: boolean;
  peaks: number[];
  currentTime: number;
  duration: number;
  isPlayheadShowing: boolean;
  playheadPosition: number;
  showPlayhead: (e: Event) => void;
  hidePlayhead: () => void;
  changeCurrentTime?: (currentTime: number) => void;
}

export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never;

export type HTMLAudioElementEventType = Omit<
  DOMAttributes<HTMLAudioElement>,
  'children' | 'dangerouslySetInnerHTML'
>;
