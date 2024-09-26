import { useEffect, useRef, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';
import type { Meta, StoryObj } from '@storybook/react';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import type { Playlist, RepeatModeType } from './_types';
import usePlaylist from './usePlaylist';

const maxPlaybackRange = 100;

const DemoComponent = (params: Parameters<typeof usePlaylist>[0]) => {
  const [repeatMode, setRepeatMode] = useState<RepeatModeType>(params.repeatMode!);
  const [dragTime, setDragTime] = useState(0);
  const isDragging = useRef(false);

  const {
    currentTime,
    duration,
    isPlaying,
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
    if (!confirm(`${audio.src}를 플레이리스트에서 삭제하시겠습니까?`)) return;

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
        <option value="all">왕복 재생</option>
        <option value="one">한곡 재생</option>
        <option value="none">반복 없음</option>
      </select>
      <div className="flex gap-3">
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1"
          onClick={() => togglePlayPause()}
        >
          {isPlaying ? '일시정지' : '재생'}
        </button>
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1"
          onClick={clearPlaylist}
        >
          플레이리스트 비우기
        </button>
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1"
          onClick={() => playPrevAudio(isPlaying)}
        >
          이전 곡 재생
        </button>
        <button
          className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1"
          onClick={() => playNextAudio(isPlaying)}
        >
          다음 곡 재생
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
                  일시정지
                </button>
              ) : (
                <button
                  className="rounded-md border border-blue-200 bg-blue-100 px-2 py-1"
                  onClick={() => changePlayingAudio(audio.id)}
                >
                  재생
                </button>
              )}
              <button
                className="rounded-md border border-blue-200 bg-blue-100 px-2 py-1"
                onClick={removeAudioInPlaylist(audio)}
              >
                제거
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
        곡 추가
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

  // 2자리 숫자로 포맷팅
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
