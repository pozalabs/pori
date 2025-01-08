import type { MutableRefObject } from 'react';
import { useEffect } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import findArrayElementById from './_utils/findArrayElementById';
import type { Playlist, RepeatModeType } from '../../types';

interface UsePlaylistEndedEventParams {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  playingId: string;
  playlist: Playlist;
  repeatMode: RepeatModeType;
  changePlayingAudio: (id: ArrayElementType<Playlist>['id']) => void;
}

const usePlaylistEndedEvent = ({
  audioRef,
  playingId,
  playlist,
  repeatMode,
  changePlayingAudio,
}: UsePlaylistEndedEventParams) => {
  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    const onAudioEnded = (): void => {
      const playingAudioIndex = findArrayElementById({
        array: playlist,
        id: playingId,
        returnIndex: true,
      });

      if (playingAudioIndex === undefined) return;

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
  }, [audioRef, changePlayingAudio, playingId, playlist, repeatMode]);
};

export default usePlaylistEndedEvent;
