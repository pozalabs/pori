import type { MouseEvent } from 'react';
import { useCallback, type InputHTMLAttributes } from 'react';

import { cn } from '@pozalabs/pokit/utils';

import { SLIDER_DEFAULT_VALUE } from './_constants';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  backgroundColor?: string;
  progressColor?: string;
  draggable?: boolean;
  max?: number;
  min?: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
}

const Slider = ({
  backgroundColor = SLIDER_DEFAULT_VALUE.backgroundColor,
  progressColor = SLIDER_DEFAULT_VALUE.progressColor,
  max = SLIDER_DEFAULT_VALUE.max,
  min = SLIDER_DEFAULT_VALUE.min,
  step = SLIDER_DEFAULT_VALUE.step,
  value,
  onValueChange,
  className,
  ...inputProps
}: SliderProps) => {
  const onSliderClick = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!onValueChange) return;

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const value = Math.round(((clickX / rect.width) * max) / step) * step;

      onValueChange(value);
    },
    [max, onValueChange, step],
  );

  return (
    <>
      <div className={cn('relative h-4 rounded-lg', className)} onClick={onSliderClick}>
        <div
          style={{ background: backgroundColor }}
          className="absolute left-0 top-0 size-full rounded-inherit"
        />
        <div
          style={{ width: `${((value ?? 0) / max) * 100}%`, background: progressColor }}
          className="absolute left-0 top-0 size-full rounded-inherit"
        />
      </div>
      <input
        type="range"
        style={{ display: 'none' }}
        max={max}
        min={min}
        step={step}
        value={value}
        readOnly
        {...inputProps}
      />
    </>
  );
};

export default Slider;
