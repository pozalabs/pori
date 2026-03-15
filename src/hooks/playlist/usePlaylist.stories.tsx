import { useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import usePlaylist from './usePlaylist';
import type { ArrayElementType } from '../../types';
import type { Playlist, RepeatModeType } from '../../types';

const maxPlaybackRange = 100;

const DemoComponent = (params: Parameters<typeof usePlaylist>[0]) => {
  const [repeatMode, setRepeatMode] = useState<RepeatModeType>(params.repeatMode!);
  const [dragTime, setDragTime] = useState(0);
  const isDragging = useRef(false);

  const {
    currentTime,
    duration,
    isPlaying,
    hasNextAudio,
    hasPrevAudio,
    playbackRange,
    playingId,
    playlist,
    addAudio,
    changePlaybackRange,
    changePlayingAudio,
    clearPlaylist,
    pause,
    playNextAudio,
    playPrevAudio,
    removeAudio,
    togglePlayPause,
  } = usePlaylist({
    ...params,
    repeatMode,
  });

  const removeAudioInPlaylist = (audio: ArrayElementType<Playlist>) => () => {
    if (!confirm(`Do you want to remove ${audio.src} from the playlist?`)) return;

    removeAudio(audio.id, true);
  };

  useEffect(() => {
    if (playlist.length === 1 && playingId !== playlist[0].id) {
      changePlayingAudio(playlist[0].id, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, playingId]);

  useEffect(() => {
    const onMouseUp = (): void => {
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
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="w-[44px]">{formatTime(currentTime)}</span>
        <input
          type="range"
          value={isDragging.current ? dragTime : playbackRange}
          min={0}
          max={maxPlaybackRange}
          step={0.01}
          onMouseDown={() => (isDragging.current = true)}
          onChange={e => {
            if (isDragging.current) {
              setDragTime(Number(e.target.value));
              return;
            }
            changePlaybackRange(Number(e.target.value));
          }}
        />
        <span className="w-[44px]">{formatTime(duration)}</span>
      </div>
      <select value={repeatMode} onChange={e => setRepeatMode(e.target.value as RepeatModeType)}>
        <option value="all">Reverse playback</option>
        <option value="one">One-track playback</option>
        <option value="none">No repeat</option>
      </select>
      <div className="flex gap-3">
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1"
          onClick={() => togglePlayPause()}
        >
          {isPlaying ? 'pause' : 'play'}
        </button>
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1"
          onClick={clearPlaylist}
        >
          Clear the playlist
        </button>
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-300"
          onClick={() => playPrevAudio(isPlaying)}
          disabled={!hasPrevAudio}
        >
          Play the previous song
        </button>
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-300"
          onClick={() => playNextAudio(isPlaying)}
          disabled={!hasNextAudio}
        >
          Play the next song
        </button>
      </div>
      <ul className="flex w-full flex-col items-center gap-4">
        {playlist.map(audio => (
          <li
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-100 p-4 text-center"
            key={audio.id}
          >
            <span>{audio.src}</span>
            <div className="flex items-center gap-2">
              {isPlaying && audio.id === playingId ? (
                <button
                  className="rounded-md border border-blue-200 bg-blue-100 px-2 py-1"
                  onClick={pause}
                >
                  pause
                </button>
              ) : (
                <button
                  className="rounded-md border border-blue-200 bg-blue-100 px-2 py-1"
                  onClick={() => changePlayingAudio(audio.id)}
                >
                  play
                </button>
              )}
              <button
                className="rounded-md border border-blue-200 bg-blue-100 px-2 py-1"
                onClick={removeAudioInPlaylist(audio)}
              >
                remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1"
        onClick={() =>
          addAudio({
            id: `${new Date().getTime()}`,
            src: 'https://cdn.pixabay.com/audio/2024/06/25/audio_7bfb8d2ab0.mp3',
          })
        }
      >
        Add song
      </button>
    </div>
  );
};

const meta = {
  title: 'usePlaylist',
  component: DemoComponent,
} satisfies Meta<typeof DemoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {
    ...PLAYLIST_DEFAULT_VALUE,
    playlist: [
      { id: '0', src: 'https://cdn.pixabay.com/audio/2023/06/12/audio_23ef6b7464.mp3' },
      { id: '1', src: 'https://cdn.pixabay.com/audio/2024/09/09/audio_7556bb3a41.mp3' },
    ],
    enabledKeyboardControl: true,
    maxPlaybackRange,
  },
};

const formatTime = (seconds: number): `${string}:${string}` => {
  if (isNaN(seconds)) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // format a number as a two-digit string
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
