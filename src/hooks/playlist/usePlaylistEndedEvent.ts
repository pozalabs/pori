import { useEffect } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import type { Playlist, RepeatModeType } from './_types';
import findArrayElementById from './_utils/findArrayElementById';

interface UsePlaylistEndedEventParams {
  audioElement: HTMLAudioElement;
  playingId: string;
  playlist: Playlist;
  repeatMode: RepeatModeType;
  changePlayingAudio: (id: ArrayElementType<Playlist>['id']) => void;
}

const usePlaylistEndedEvent = ({
  audioElement,
  playingId,
  playlist,
  repeatMode,
  changePlayingAudio,
}: UsePlaylistEndedEventParams) => {
  useEffect(() => {
    const onAudioEnded = (): void => {
      const playingAudioIndex = findArrayElementById({
        array: playlist,
        id: playingId,
        returnIndex: true,
      });

      if (playingAudioIndex === undefined || playingAudioIndex < 0) return;

      if (playingAudioIndex >= playlist.length - 1) {
        if (repeatMode === 'all') {
          changePlayingAudio(playlist[0].id);
        }
        return;
      }

      changePlayingAudio(playlist[playingAudioIndex + 1].id);
    };

    audioElement.addEventListener('ended', onAudioEnded);

    return () => {
      audioElement.removeEventListener('ended', onAudioEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioElement, playingId, repeatMode]);
};

export default usePlaylistEndedEvent;
