import type { ReactNode } from 'react';
import { useRef } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';
import type { Meta, StoryObj } from '@storybook/react';

import type { AudioPlayerHandles } from './_types';
import AudioPlayer from './AudioPlayer';
import type { AudioPlayerProviderProps } from './AudioPlayerProvider';
import type { Playlist } from '../../hooks';

const DemoComponent = (props: Omit<AudioPlayerProviderProps, 'children'>) => {
  const ref = useRef<AudioPlayerHandles>(null);

  const addPlaylist = (): void => {
    if (!ref.current) return;

    ref.current.addAudio(
      {
        id: new Date().toISOString(),
        src: 'https://cdn.pixabay.com/audio/2024/09/09/audio_7556bb3a41.mp3',
        title: '추가된 노래',
      },
      false,
    );
  };

  const renderPlaylistItem = (audio: ArrayElementType<Playlist>): ReactNode => {
    return (
      <li key={audio.id} className="flex items-center justify-between gap-4">
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
          renderItem={renderPlaylistItem}
          className="flex w-4/5 flex-col gap-4"
        />
      </AudioPlayer.Provider>
      <button onClick={addPlaylist}>플레이리스트에 곡 추가</button>
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
        title: '첫 번째 노래',
      },
      {
        id: '1',
        src: 'https://cdn.pixabay.com/audio/2024/09/09/audio_7556bb3a41.mp3',
        title: '두 번째 노래',
      },
    ],
    repeatMode: 'all',
    enabledKeyboardControl: true,
  },
};
