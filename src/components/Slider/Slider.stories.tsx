/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from 'react';

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
    className: 'w-[400px] h-[20px] rounded-full',
    step: 5,
  },
  render: (props: Parameters<typeof Slider>[0]) => {
    const [value, setValue] = useState(0);

    const onValueChange = (value: number): void => {
      setValue(value);
    };

    return (
      <div className="relative">
        <Slider value={value} onValueChange={onValueChange} onDrag={onValueChange} {...props} />
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
    className: 'w-[400px]',
    step: 0.01,
  },
  render: (props: Parameters<typeof Slider>[0]) => {
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
      src: 'https://cdn.pixabay.com/audio/2023/06/12/audio_23ef6b7464.mp3',
      enabledKeyboardControl: true,
    });

    const onCurrentTimeSliderChange = (currentTime: number): void => {
      changeCurrentTime(currentTime);
    };

    const onCurrentTimeSliderDrag = (currentTime: number): void => {
      if (isDragging.current) {
        setDragTime(currentTime);
        return;
      }
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
      <div className="flex flex-col items-center gap-4">
        <Slider
          {...props}
          max={duration}
          value={isDragging.current ? dragTime : currentTime}
          onValueChange={onCurrentTimeSliderChange}
          onDrag={onCurrentTimeSliderDrag}
          onDragStart={() => (isDragging.current = true)}
        />
        <div className="flex items-center justify-center gap-2">
          <span className="text-[12px]">볼륨</span>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onValueChange={onVolumeSliderChange}
            onDrag={onVolumeSliderChange}
            className="h-2 w-[100px]"
          />
        </div>
        <div className="flex justify-center gap-2">
          <button
            className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
            onClick={shiftTimeForward}
          >
            앞으로 10초 이동
          </button>
          <button
            className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
            onClick={() => togglePlayPause()}
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <button
            className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
            onClick={shiftTimeBackward}
          >
            뒤로 10초 이동
          </button>
        </div>
      </div>
    );
  },
};
