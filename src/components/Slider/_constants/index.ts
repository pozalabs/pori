interface ISliderDefaultValue {
  orientation: 'horizontal' | 'vertical';
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
