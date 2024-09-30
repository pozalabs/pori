/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from 'react';

import { cn } from '@pozalabs/pokit/utils';
import type { Meta, StoryObj } from '@storybook/react';

import { SLIDER_DEFAULT_VALUE } from './_constants';
import Slider from './Slider';
import { useAudio } from '../../hooks';

const meta = {
  title: 'Slider',
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...SLIDER_DEFAULT_VALUE,
    className: 'w-full h-full rounded-full',
    step: 5,
  },
  render: (props: Parameters<typeof Slider>[0]) => {
    const [value, setValue] = useState(0);

    const onValueChange = (value: number): void => {
      setValue(value);
    };

    return (
      <div
        className={cn(
          'relative',
          props.orientation?.startsWith('horizontal') ? 'w-[400px] h-[20px]' : 'h-[400px] w-[20px]',
        )}
      >
        <Slider value={value} onChange={onValueChange} onDrag={onValueChange} {...props} />
        <span className="absolute" style={{ left: `${(value / props.max!) * 100 - 2}%` }}>
          {value}
        </span>
      </div>
    );
  },
};

export const Player: Story = {
  args: {
    ...SLIDER_DEFAULT_VALUE,
    railClassName: 'bg-slate-100',
    trackClassName: 'bg-violet-300',
    thumbClassName: 'hidden',
    step: 0.01,
  },
  render: (props: Parameters<typeof Slider>[0]) => {
    const [isVolumeShowing, setIsVolumeShowing] = useState(false);

    const isDragging = useRef(false);
    const [dragTime, setDragTime] = useState(0);

    const {
      currentTime,
      duration,
      isPlaying,
      volume,
      changeCurrentTime,
      changeVolume,
      shiftTimeBackward,
      shiftTimeForward,
      togglePlayPause,
    } = useAudio({
      src: 'https://cdn.pixabay.com/audio/2024/09/09/audio_7556bb3a41.mp3',
      enabledKeyboardControl: true,
    });

    const onCurrentTimeSliderChange = (currentTime: number): void => {
      changeCurrentTime(currentTime);
    };

    const onCurrentTimeSliderDrag = (currentTime: number): void => {
      if (!isDragging.current) return;
      setDragTime(currentTime);
    };

    const onCurrentTimeSliderDragStart = (currentTime: number): void => {
      isDragging.current = true;
      setDragTime(currentTime);
    };

    const onCurrentTimeSliderDragEnd = (currentTime: number): void => {
      if (!isDragging.current) return;

      isDragging.current = false;
      changeCurrentTime(currentTime);
    };

    const onVolumeSliderChange = (volume: number): void => {
      changeVolume(volume);
    };

    useEffect(() => {
      const onMouseUp = () => {
        if (!isDragging.current) return;

        isDragging.current = false;
        changeCurrentTime(dragTime);
      };

      document.addEventListener('mouseup', onMouseUp);

      return () => {
        document.removeEventListener('mouseup', onMouseUp);
      };
    }, [changeCurrentTime, dragTime]);

    return (
      <main className="flex h-dvh w-dvw items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn('flex items-end gap-4', props.orientation === 'vertical' && 'h-[400px]')}
          >
            <div
              className={
                props.orientation?.startsWith('horizontal')
                  ? 'h-[20px] w-[400px]'
                  : 'h-[400px] w-[20px]'
              }
            >
              <Slider
                {...props}
                max={duration}
                value={isDragging.current ? dragTime : currentTime}
                onChange={onCurrentTimeSliderChange}
                onDrag={onCurrentTimeSliderDrag}
                onDragStart={onCurrentTimeSliderDragStart}
                onDragEnd={onCurrentTimeSliderDragEnd}
              />
            </div>
            <div className="relative flex items-center justify-center gap-2">
              <span
                className="cursor-pointer text-[12px]"
                onClick={() => setIsVolumeShowing(prev => !prev)}
              >
                볼륨
              </span>
              {isVolumeShowing && (
                <Slider
                  orientation="vertical"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={onVolumeSliderChange}
                  onDrag={onVolumeSliderChange}
                  className="absolute bottom-[32px] h-[100px] w-1"
                  trackClassName="bg-violet-300 transition-all duration-100"
                  thumbClassName="bg-violet-300 w-3 border-violet-100 transition-all duration-100 -translate-x-1 hover:shadow-volume"
                />
              )}
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <button
              className="rounded-md border border-violet-100 bg-violet-50 px-3 py-1 text-[14px]"
              onClick={shiftTimeForward}
            >
              앞으로 10초 이동
            </button>
            <button
              className="rounded-md border border-violet-100 bg-violet-50 px-3 py-1 text-[14px]"
              onClick={() => togglePlayPause()}
            >
              {isPlaying ? '일시정지' : '재생'}
            </button>
            <button
              className="rounded-md border border-violet-100 bg-violet-50 px-3 py-1 text-[14px]"
              onClick={shiftTimeBackward}
            >
              뒤로 10초 이동
            </button>
          </div>
        </div>
      </main>
    );
  },
};
