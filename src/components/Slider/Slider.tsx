import type { MouseEvent } from 'react';
import { useCallback, useMemo, useRef, type InputHTMLAttributes } from 'react';

import { cn } from '@pozalabs/pokit/utils';

import { SLIDER_DEFAULT_VALUE } from './_constants';

interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  orientation?: 'horizontal' | 'vertical';
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

/**
 * 스타일을 커스텀할 수 있는 Slider 컴포넌트입니다.
 * @param SliderProps
 * ```
 * interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
 *    orientation?: 'horizontal' | 'vertical';
 *    max?: number;
 *    min?: number;
 *    step?: number;
 *    value?: number;
 *    railClassName?: string;
 *    trackClassName?: string;
 *    thumbClassName?: string;
 *    railClassName?: string;
 *    onChange?: (value: number) => void;
 *    onDrag?: (value: number) => void;
 *    onDragStart?: (value: number) => void;
 *    onDragEnd?: (value: number) => void;
 * }
 * ```
 * - orientation : 슬라이더의 방향입니다. (default: `horizontal`)
 * - max : 슬라이더 value의 최댓값입니다. (default: `100`)
 * - min : 슬라이더 value의 최솟값입니다. (defulat: `0`)
 * - step : 슬라이더 value의 단위입니다. 클릭 또는 드래그 이벤트를 통해 전달되는 value는 항상 step 단위로 포맷팅됩니다. (default: `1`)
 */
const Slider = ({
  orientation = SLIDER_DEFAULT_VALUE.orientation,
  max = SLIDER_DEFAULT_VALUE.max,
  min = SLIDER_DEFAULT_VALUE.min,
  step = SLIDER_DEFAULT_VALUE.step,
  value,
  railClassName,
  trackClassName,
  thumbClassName,
  onChange,
  onDrag,
  onDragStart,
  onDragEnd,
  className,
  ...inputProps
}: SliderProps) => {
  const isDraggingRef = useRef(false);

  const progressPercentage = useMemo(() => ((value ?? 0) / max) * 100, [max, value]);

  const getValue = useCallback(
    (e: MouseEvent<HTMLDivElement>): number => {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = rect.bottom - e.clientY;
      const value =
        orientation === 'horizontal' ? (clickX / rect.width) * max : (clickY / rect.height) * max;
      const formattedValue = Math.round(value / step) * step;

      if (formattedValue > max) return max;
      if (formattedValue < min) return min;

      return formattedValue;
    },
    [max, min, orientation, step],
  );

  const onSliderClick = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!onChange) return;

      onChange(getValue(e));
    },
    [getValue, onChange],
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
      e.preventDefault();

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
    <div
      className={cn(
        'relative rounded-lg',
        orientation === 'horizontal' ? 'w-full h-4' : 'w-4 h-full',
        className,
      )}
      onClick={onSliderClick}
      onMouseMove={onSliderDrag}
      onMouseDown={onSliderDragStart}
      onMouseUp={onSliderDragEnd}
      onMouseLeave={onSliderDragEnd}
      role="slider"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
    >
      <span
        className={cn('absolute left-0 top-0 size-full rounded-inherit bg-gray-100', railClassName)}
      />
      <span
        style={{
          [orientation === 'horizontal' ? 'width' : 'height']: `${progressPercentage}%`,
        }}
        className={cn(
          'absolute left-0 size-full rounded-inherit bg-[#0873FF]',
          orientation === 'horizontal' ? 'top-0' : 'bottom-0',
          trackClassName,
        )}
      />
      <span
        style={
          orientation === 'horizontal'
            ? { left: `${progressPercentage}%` }
            : { top: `${100 - progressPercentage}%` }
        }
        className={cn(
          'absolute rounded-full bg-[#0873FF] h-full aspect-square',
          orientation === 'horizontal'
            ? 'top-0 -translate-x-1/2'
            : 'left-0 bottom-0 -translate-y-1/2',
          thumbClassName,
        )}
      />
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
    </div>
  );
};

export default Slider;
