import type { InputHTMLAttributes } from 'react';

/**
 * Orientation for the `Slider` component.
 */
export type SliderOrientationType =
  | 'horizontal'
  | 'vertical'
  | 'horizontal-reverse'
  | 'vertical-reverse';

/**
 * Props for `Slider`.
 */
export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> {
  orientation?: SliderOrientationType;
  max?: number;
  min?: number;
  step?: number;
  value?: number;
  railClassName?: string;
  trackClassName?: string;
  thumbClassName?: string;
  onChange?: (value: number) => void;
  onDrag?: (value: number) => void;
  onDragStart?: (value: number) => void;
  onDragEnd?: (value: number) => void;
}
