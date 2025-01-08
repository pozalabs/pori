import { useCallback, useContext, useRef } from 'react';

import { AudioPlayerContext } from './AudioPlayerProvider';
import type { AudioPlayerVolumeProgressBarProps } from '../../../types';
import Slider from '../../Slider';
import { AUDIO_PLAYER_PROGRESS_BAR_DEFAULT_VALUE } from '../_constants';

const AudioPlayerVolumeProgressBar = ({
  draggable = AUDIO_PLAYER_PROGRESS_BAR_DEFAULT_VALUE.draggable,
  step = AUDIO_PLAYER_PROGRESS_BAR_DEFAULT_VALUE.step,
  ...sliderProps
}: AudioPlayerVolumeProgressBarProps) => {
  const { volume, changeVolume } = useContext(AudioPlayerContext);

  const isDraggingRef = useRef(false);

  const onSliderChange = useCallback(
    (volume: number): void => {
      changeVolume(volume);
    },
    [changeVolume],
  );

  const onSliderDrag = useCallback(
    (volume: number): void => {
      if (!isDraggingRef.current) return;

      onSliderChange(volume);
    },
    [onSliderChange],
  );

  const onSliderDragStart = useCallback(
    (volume: number): void => {
      isDraggingRef.current = true;
      onSliderChange(volume);
    },
    [onSliderChange],
  );

  const onSliderDragEnd = useCallback(
    (volume: number): void => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      onSliderChange(volume);
    },
    [onSliderChange],
  );

  return (
    <Slider
      {...sliderProps}
      max={1}
      min={0}
      step={step}
      value={volume}
      onChange={onSliderChange}
      onDrag={draggable ? onSliderDrag : undefined}
      onDragStart={draggable ? onSliderDragStart : undefined}
      onDragEnd={draggable ? onSliderDragEnd : undefined}
    />
  );
};

export default AudioPlayerVolumeProgressBar;
