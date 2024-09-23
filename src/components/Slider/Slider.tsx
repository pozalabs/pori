import type { MouseEvent } from 'react';
import { useCallback, useRef, type InputHTMLAttributes } from 'react';

import { cn } from '@pozalabs/pokit/utils';

import { SLIDER_DEFAULT_VALUE } from './_constants';

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  backgroundColor?: string;
  progressColor?: string;
  max?: number;
  min?: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  onDrag?: (value: number) => void;
  onDragStart?: (value: number) => void;
  onDragEnd?: (value: number) => void;
}

const Slider = ({
  backgroundColor = SLIDER_DEFAULT_VALUE.backgroundColor,
  progressColor = SLIDER_DEFAULT_VALUE.progressColor,
  max = SLIDER_DEFAULT_VALUE.max,
  min = SLIDER_DEFAULT_VALUE.min,
  step = SLIDER_DEFAULT_VALUE.step,
  value,
  onValueChange,
  onDrag,
  onDragStart,
  onDragEnd,
  className,
  ...inputProps
}: SliderProps) => {
  const isDraggingRef = useRef(false);

  const getValue = useCallback(
    (e: MouseEvent<HTMLDivElement>): number => {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const value = Math.round(((clickX / rect.width) * max) / step) * step;

      return value;
    },
    [max, step],
  );

  const onSliderClick = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!onValueChange) return;

      onValueChange(getValue(e));
    },
    [getValue, onValueChange],
  );

  const onSliderDrag = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!onDrag || !isDraggingRef.current) return;

      onDrag(getValue(e));
    },
    [getValue, onDrag],
  );

  const onSliderDragStart = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      isDraggingRef.current = true;

      if (!onDragStart) return;

      onDragStart(getValue(e));
    },
    [getValue, onDragStart],
  );

  const onSliderDragEnd = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      isDraggingRef.current = false;

      if (!onDragEnd) return;

      onDragEnd(getValue(e));
    },
    [getValue, onDragEnd],
  );

  return (
    <>
      <div
        className={cn('relative h-4 rounded-lg', className)}
        onClick={onSliderClick}
        onMouseMove={onSliderDrag}
        onMouseDown={onSliderDragStart}
        onMouseUp={onSliderDragEnd}
        onMouseLeave={onSliderDragEnd}
      >
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
