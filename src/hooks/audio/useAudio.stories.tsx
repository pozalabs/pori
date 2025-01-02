import { useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { AUDIO_DEFAULT_VALUE } from './_constants';
import useAudio from './useAudio';

const DemoComponent = (params: Parameters<typeof useAudio>[0]) => {
  const isDragging = useRef(false);
  const [dragTime, setDragTime] = useState(0);

  const {
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    playbackRange,
    playbackRate,
    volume,
    changeCurrentSrc,
    changePlaybackRange,
    changePlaybackRate,
    changeVolume,
    resetAudio,
    toggleMuted,
    togglePlayPause,
  } = useAudio(params);

  useEffect(() => {
    const onMouseUp = () => {
      if (!isDragging.current) return;

      isDragging.current = false;
      changePlaybackRange(dragTime);
    };

    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [changePlaybackRange, dragTime]);

  return (
    <div className="flex flex-col gap-3">
      <p>src: {currentSrc}</p>
      <div className="flex items-center gap-2">
        <span>
          {Math.round(
            isDragging.current
              ? (dragTime * duration) / (params.maxPlaybackRange ?? 100)
              : currentTime,
          )}
          s
        </span>
        <input
          type="range"
          value={isDragging.current ? dragTime : playbackRange}
          min={0}
          max={params.maxPlaybackRange}
          step={0.01}
          onMouseDown={() => (isDragging.current = true)}
          onChange={e => {
            if (isDragging.current) {
              setDragTime(Number(e.target.value));
              return;
            }
            changePlaybackRange(Number(e.target.value));
          }}
          className="w-full"
        />
        <span>{Math.round(duration)}s</span>
      </div>
      <select value={playbackRate} onChange={e => changePlaybackRate(Number(e.target.value))}>
        <option value={0.5}>0.5</option>
        <option value={1}>1</option>
        <option value={1.5}>1.5</option>
        <option value={2}>2</option>
      </select>
      <div className="flex items-center gap-4">
        <button
          className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
          onClick={() => togglePlayPause()}
        >
          {isPlaying ? 'pause' : 'play'}
        </button>
        <button className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1" onClick={stop}>
          stop
        </button>
        {[0, 25, 50, 75, 100].map(progress => (
          <button onClick={() => changePlaybackRange(progress)} key={progress}>
            {progress}%
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          value={volume}
          min={0}
          max={params.maxVolume}
          step={0.01}
          onChange={e => changeVolume(Number(e.target.value))}
        />
        <button
          className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
          onClick={toggleMuted}
        >
          {volume <= 0 ? 'unmute' : 'mute'}
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
          onClick={resetAudio}
        >
          Reset audio
        </button>
        <button
          className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1"
          onClick={() => changeCurrentSrc(params.src ?? '')}
        >
          Reset src
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
    ...AUDIO_DEFAULT_VALUE,
    src: 'https://cdn.pixabay.com/audio/2023/06/12/audio_23ef6b7464.mp3',
    enabledKeyboardControl: true,
  },
};
