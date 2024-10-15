import type { MouseEvent, TouchEvent } from 'react';
import { useCallback, useMemo, useRef, type InputHTMLAttributes } from 'react';

import { cn } from '@pozalabs/pokit/utils';

import { SLIDER_DEFAULT_VALUE } from './_constants';
import type { SliderOrientationType } from './_types';

interface SliderProps
  extends Omit<
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

/**
 * 스타일을 커스텀할 수 있는 Slider 컴포넌트입니다.
 * @param SliderProps
 * ```
 * interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
 *    orientation?: 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
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
 * - min : 슬라이더 value의 최솟값입니다. (default: `0`)
 * - step : 슬라이더 value의 단위입니다. 클릭 또는 드래그 이벤트를 통해 전달되는 value는 항상 step 단위로 포맷팅됩니다. (default: `1`)
 */
const Slider = ({
  orientation = SLIDER_DEFAULT_VALUE.orientation,
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const progressPercentage = useMemo(() => {
    const max = Number(inputRef.current?.max ?? '0');
    return ((inputProps.value ?? 0) / (max > 0 ? max : 1)) * 100;
  }, [inputProps.value]);

  const getValueByOrientation = useCallback(
    (rect: DOMRect, clientX: number, clientY: number): number => {
      if (!inputRef.current) return 0;

      const clickX = clientX - rect.left;
      const clickY = rect.bottom - clientY;

      const max = Number(inputRef.current.max);

      switch (orientation) {
        case 'horizontal': {
          return (clickX / rect.width) * max;
        }
        case 'horizontal-reverse': {
          return ((rect.width - clickX) / rect.width) * max;
        }
        case 'vertical': {
          return (clickY / rect.height) * max;
        }
        case 'vertical-reverse': {
          return ((rect.height - clickY) / rect.height) * max;
        }
      }
    },
    [orientation],
  );

  const getValue = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>): number => {
      if (!inputRef.current) return 0;

      const max = Number(inputRef.current.max);
      const min = Number(inputRef.current.min);
      const step = Number(inputRef.current.step);

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const { clientX, clientY } =
        'changedTouches' in e
          ? e.type === 'touchend' || e.type === 'touchcancel'
            ? e.changedTouches[0]
            : e.touches[0]
          : e;

      const value = getValueByOrientation(rect, clientX, clientY);
      const formattedValue = Math.round(value / step) * step;

      if (formattedValue > max) return max;
      if (formattedValue < min) return min;

      return formattedValue;
    },
    [getValueByOrientation],
  );

  const onSliderClick = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!onChange) return;

      onChange(getValue(e));
    },
    [getValue, onChange],
  );

  const onSliderDrag = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>): void => {
      if (!onDrag || !isDraggingRef.current) return;

      onDrag(getValue(e));
    },
    [getValue, onDrag],
  );

  const onSliderDragStart = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>): void => {
      isDraggingRef.current = true;

      if (!onDragStart) return;

      onDragStart(getValue(e));
    },
    [getValue, onDragStart],
  );

  const onSliderDragEnd = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>): void => {
      e.preventDefault();

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
        orientation.startsWith('horizontal') ? 'w-full h-4' : 'w-4 h-full',
        className,
      )}
      onClick={onSliderClick}
      onMouseMove={onSliderDrag}
      onMouseDown={onSliderDragStart}
      onMouseUp={onSliderDragEnd}
      onMouseLeave={onSliderDragEnd}
      onTouchMove={onSliderDrag}
      onTouchStart={onSliderDragStart}
      onTouchEnd={onSliderDragEnd}
      onTouchCancel={onSliderDragEnd}
      role="slider"
      aria-valuemax={Number(inputRef.current?.max ?? '0')}
      aria-valuemin={Number(inputRef.current?.min ?? '0')}
      aria-valuenow={Number(inputRef.current?.value ?? '0')}
    >
      <span
        className={cn('absolute left-0 top-0 size-full rounded-inherit bg-gray-100', railClassName)}
      />
      <span
        style={{
          [orientation.startsWith('horizontal') ? 'width' : 'height']: `${progressPercentage}%`,
        }}
        className={cn(
          'absolute size-full rounded-inherit bg-[#0873FF]',
          orientation === 'horizontal' || orientation === 'vertical-reverse' ? 'top-0' : 'bottom-0',
          orientation === 'horizontal-reverse' ? 'right-0' : 'left-0',
          trackClassName,
        )}
      />
      <span
        style={
          orientation.startsWith('horizontal')
            ? {
                left: `${orientation.endsWith('reverse') ? 100 - progressPercentage : progressPercentage}%`,
              }
            : {
                top: `${orientation.endsWith('reverse') ? progressPercentage : 100 - progressPercentage}%`,
              }
        }
        className={cn(
          'absolute rounded-full bg-[#0873FF] aspect-square',
          orientation === 'horizontal' || orientation === 'vertical-reverse' ? 'top-0' : 'bottom-0',
          orientation.startsWith('horizontal')
            ? 'h-full w-max -translate-x-1/2'
            : 'w-full h-max left-0 -translate-y-1/2',
          thumbClassName,
        )}
      />
      <input
        {...inputProps}
        type="range"
        style={{ display: 'none' }}
        max={inputProps.max ?? SLIDER_DEFAULT_VALUE.max}
        min={inputProps.min ?? SLIDER_DEFAULT_VALUE.min}
        step={inputProps.step ?? SLIDER_DEFAULT_VALUE.step}
        value={inputProps.value}
        readOnly
        ref={inputRef}
      />
    </div>
  );
};

export default Slider;
