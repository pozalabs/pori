import type { SliderOrientationType } from '../../../types';

interface ISliderDefaultValue {
  orientation: SliderOrientationType;
  max: number;
  min: number;
  step: number;
}

export const SLIDER_DEFAULT_VALUE: ISliderDefaultValue = {
  orientation: 'horizontal',
  max: 100,
  min: 0,
  step: 1,
};
