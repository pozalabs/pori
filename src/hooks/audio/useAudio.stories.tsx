import { useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import useAudio from './useAudio';

const DemoComponent = ({ src }: { src: string }) => {
  const [maxProgressTime] = useState(100);
  const [maxProgressVolume] = useState(1);

  const isDragging = useRef(false);
  const [dragTime, setDragTime] = useState(0);

  const {
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    progressTime,
    volume,
    changeProgressTime,
    changeVolume,
    toggleMuted,
    togglePlayPause,
  } = useAudio({
    src,
    maxProgressTime,
    maxProgressVolume,
  });

  useEffect(() => {
    const onMouseUp = () => {
      if (!isDragging.current) return;

      isDragging.current = false;
      changeProgressTime(dragTime);
    };

    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [changeProgressTime, dragTime]);

  return (
    <div>
      <p>src: {currentSrc}</p>
      <div className="flex items-center gap-2">
        <span>
          {Math.round(isDragging.current ? (dragTime * duration) / maxProgressTime : currentTime)}s
        </span>
        <input
          type="range"
          value={isDragging.current ? dragTime : progressTime}
          min={0}
          max={maxProgressTime}
          step={0.01}
          onMouseDown={() => (isDragging.current = true)}
          onChange={e => {
            if (isDragging.current) {
              setDragTime(Number(e.target.value));
              return;
            }
            changeProgressTime(Number(e.target.value));
          }}
          className="w-full"
        />
        <span>{Math.round(duration)}s</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
          onClick={() => togglePlayPause()}
        >
          {isPlaying ? '일시정지' : '재생'}
        </button>
        {[0, 25, 50, 75, 100].map(progress => (
          <button onClick={() => changeProgressTime(progress)} key={progress}>
            {progress}%
          </button>
        ))}
      </div>
      <div>
        <input
          type="range"
          value={volume}
          min={0}
          max={maxProgressVolume}
          step={0.01}
          onChange={e => changeVolume(Number(e.target.value))}
        />
        <button
          className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
          onClick={toggleMuted}
        >
          {volume <= 0 ? '음소거 해제' : '음소거'}
        </button>
      </div>
    </div>
  );
};

const meta = {
  title: 'useAudio',
  component: DemoComponent,
} satisfies Meta<typeof DemoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {
    src: 'https://cdn.pixabay.com/audio/2023/06/12/audio_23ef6b7464.mp3',
  },
};
