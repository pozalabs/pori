import { useCallback, useContext, useRef, useState } from 'react';

import { cn } from '@pozalabs/pokit/utils';

import { AUDIO_PLAYER_PROGRESS_BAR_DEFAULT_VALUE } from './_constants';
import { AudioPlayerContext } from './AudioPlayerProvider';
import Slider from '../Slider/Slider';

interface AudioPlayerProgressBarProps
  extends Omit<
    Parameters<typeof Slider>[0],
    'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  draggable?: boolean;
}

const AudioPlayerProgressBar = ({
  draggable = AUDIO_PLAYER_PROGRESS_BAR_DEFAULT_VALUE.draggable,
  className,
  railClassName,
  trackClassName,
  thumbClassName,
  ...sliderProps
}: AudioPlayerProgressBarProps) => {
  const { currentTime, duration, changeCurrentTime } = useContext(AudioPlayerContext);

  const isDraggingRef = useRef(false);
  const [dragTime, setDragTime] = useState(0);

  const onSliderChange = useCallback(
    (currentTime: number): void => {
      changeCurrentTime(currentTime);
    },
    [changeCurrentTime],
  );

  const onSliderDrag = useCallback((currentTime: number): void => {
    if (!isDraggingRef.current) return;

    setDragTime(currentTime);
  }, []);

  const onSliderDragStart = useCallback((currentTime: number): void => {
    isDraggingRef.current = true;
    setDragTime(currentTime);
  }, []);

  const onSliderDragEnd = useCallback(
    (currentTime: number): void => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      changeCurrentTime(currentTime);
    },
    [changeCurrentTime],
  );

  return (
    <Slider
      {...sliderProps}
      max={duration}
      min={0}
      value={isDraggingRef.current && draggable ? dragTime : currentTime}
      onChange={onSliderChange}
      onDrag={draggable ? onSliderDrag : undefined}
      onDragStart={draggable ? onSliderDragStart : undefined}
      onDragEnd={draggable ? onSliderDragEnd : undefined}
      className={cn('w-[50%] h-[20px] rounded-full', className)}
      railClassName={railClassName}
      trackClassName={trackClassName}
      thumbClassName={cn('hidden', thumbClassName)}
    />
  );
};

export default AudioPlayerProgressBar;
