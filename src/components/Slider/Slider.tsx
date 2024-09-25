import type { MouseEvent } from 'react';
import { useCallback, useRef, type InputHTMLAttributes } from 'react';

import { cn } from '@pozalabs/pokit/utils';

import { SLIDER_DEFAULT_VALUE } from './_constants';

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  max?: number;
  min?: number;
  step?: number;
  value?: number;
  railClassName?: string;
  trackClassName?: string;
  thumbClassName?: string;
  onValueChange?: (value: number) => void;
  onDrag?: (value: number) => void;
  onDragStart?: (value: number) => void;
  onDragEnd?: (value: number) => void;
}

const Slider = ({
  max = SLIDER_DEFAULT_VALUE.max,
  min = SLIDER_DEFAULT_VALUE.min,
  step = SLIDER_DEFAULT_VALUE.step,
  value,
  railClassName,
  trackClassName,
  thumbClassName,
  onValueChange,
  onDrag,
  onDragStart,
  onDragEnd,
  className,
  ...inputProps
}: SliderProps) => {
  const isDraggingRef = useRef(false);
  const transitionEnabledRef = useRef(false);

  const getValue = useCallback(
    (e: MouseEvent<HTMLDivElement>): number => {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const value = Math.round(((clickX / rect.width) * max) / step) * step;

      if (value > max) return max;
      if (value < min) return min;

      return value;
    },
    [max, min, step],
  );

  const onSliderClick = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!onValueChange) return;

      transitionEnabledRef.current = true;
      onValueChange(getValue(e));
    },
    [getValue, onValueChange],
  );

  const onSliderDrag = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!onDrag || !isDraggingRef.current) return;

      transitionEnabledRef.current = false;
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
          className={cn(
            'absolute left-0 top-0 size-full rounded-inherit bg-gray-100',
            railClassName,
          )}
        />
        <div
          style={{ width: `${((value ?? 0) / max) * 100}%` }}
          className={cn(
            'absolute left-0 top-0 size-full rounded-inherit bg-[#0873FF]',
            transitionEnabledRef.current && 'transition-all duration-200 ease-in-out',
            trackClassName,
          )}
        />
        <div
          style={{ left: `calc(${((value ?? 0) / max) * 100}%)` }}
          className={cn(
            'absolute top-0 rounded-full bg-[#0873FF] h-full aspect-square -translate-x-1/2',
            transitionEnabledRef.current && 'transition-all duration-200 ease-in-out',
            thumbClassName,
          )}
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
