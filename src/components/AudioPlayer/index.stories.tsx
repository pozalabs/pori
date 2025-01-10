import type { DragEvent, ReactNode } from 'react';
import { useRef } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';
import type { Meta, StoryObj } from '@storybook/react';

import type { AudioPlayerProviderProps } from './_components/AudioPlayerProvider';
import type { AudioPlayerHandles } from './_types';
import type { Playlist } from '../../hooks';

import AudioPlayer from '.';

const DemoComponent = (props: Omit<AudioPlayerProviderProps, 'children'>) => {
  const ref = useRef<AudioPlayerHandles>(null);

  const addPlaylist = (): void => {
    if (!ref.current) return;

    ref.current.addAudio(
      {
        id: new Date().toISOString(),
        src: 'https://cdn.pixabay.com/audio/2024/09/09/audio_7556bb3a41.mp3',
        title: 'added song',
      },
      false,
    );
  };

  const onPlaylistItemDragStart =
    (id: ArrayElementType<Playlist>['id']) =>
    (e: DragEvent<HTMLLIElement>): void => {
      e.dataTransfer.setData('draggedItem', id);
    };

  const onPlaylistDragOver = (e: DragEvent<HTMLUListElement>): void => {
    e.preventDefault();
  };

  const onPlaylistDrop = (e: DragEvent<HTMLUListElement>): void => {
    e.preventDefault();

    const draggedItemId = e.dataTransfer.getData('draggedItem');
    const target = (e.target as HTMLLIElement).closest('li');

    if (!target) return;

    const index = Array.from((target.parentNode as HTMLUListElement).children).indexOf(target);
    ref.current?.changeAudioIndex(draggedItemId, index!);
  };

  const renderPlaylistItem = (audio: ArrayElementType<Playlist>): ReactNode => {
    return (
      <li
        key={audio.id}
        draggable
        className="flex cursor-grab items-center justify-between gap-4 active:cursor-grabbing"
        onDragStart={onPlaylistItemDragStart(audio.id)}
      >
        <span>{audio.title as string}</span>
        <AudioPlayer.PlayPauseButton audioId={audio.id} />
      </li>
    );
  };

  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center gap-4">
      <AudioPlayer.Provider {...props} ref={ref}>
        <div className="flex w-full items-center justify-center gap-4">
          <AudioPlayer.CurrentTime />
          <AudioPlayer.ProgressBar step={0.01} />
          <AudioPlayer.Duration />
          <div className="flex w-[10%] items-center gap-2">
            <AudioPlayer.VolumeButton />
            <AudioPlayer.VolumeProgressBar
              className="h-[8px] w-full"
              thumbClassName="w-[12px] h-[12px] -translate-y-[2px]"
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <AudioPlayer.SkipStartButton />
          <AudioPlayer.ShiftForwardButton />
          <AudioPlayer.PlayPauseButton />
          <AudioPlayer.StopButton />
          <AudioPlayer.ShiftBackwardButton />
          <AudioPlayer.SkipEndButton />
        </div>
        <div>
          <AudioPlayer.RepeatButton />
        </div>
        <AudioPlayer.Playlist
          draggable
          renderItem={renderPlaylistItem}
          className="flex w-4/5 flex-col gap-4"
          onDragOver={onPlaylistDragOver}
          onDrop={onPlaylistDrop}
        />
      </AudioPlayer.Provider>
      <button onClick={addPlaylist}>Add songs to playlist</button>
    </div>
  );
};

const meta = {
  title: 'AudioPlayer',
  component: DemoComponent,
} satisfies Meta<typeof DemoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playlist: [
      {
        id: '0',
        src: 'https://cdn.pixabay.com/audio/2023/06/12/audio_23ef6b7464.mp3',
        title: 'first song',
      },
      {
        id: '1',
        src: 'https://cdn.pixabay.com/audio/2024/09/09/audio_7556bb3a41.mp3',
        title: 'second song',
      },
    ],
    repeatMode: 'all',
    enabledKeyboardControl: true,
  },
};

export const SupportHls: Story = {
  args: {
    playlist: [
      {
        id: '0',
        src: 'https://dev.cdn.eapy.io/audio/output.m3u8',
        title: '첫 번째 노래',
      },
      {
        id: '1',
        src: 'https://dev.cdn.eapy.io/audio/output3.m3u8',
        title: '두 번째 노래',
      },
    ],
    repeatMode: 'all',
    enabledKeyboardControl: true,
  },
};
