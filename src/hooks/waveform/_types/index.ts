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
      | 'waveColor'
      | 'progressColor'
      | 'hoveredColor'
      | 'bgColor'
      | 'className'
      | 'controls'
    >
  > {
  enabled: boolean;
  peaks: number[];
  currentTime: number;
  duration: number;
  isHovering: boolean;
  hoveredWidth: number;
  showHoveredWaveform: (e: Event) => void;
  hideHoveredWaveform: () => void;
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
