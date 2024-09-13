import { useCallback, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import type { Playlist, RepeatModeType } from './_types';
import findArrayElementById from './_utils/findArrayElementById';
import usePlayingAudio from './usePlayingAudio';
import usePlaylistEndedEvent from './usePlaylistEndedEvent';
import useAudio from '../audio/useAudio';

interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
  playlist?: Playlist;
  repeatMode?: RepeatModeType;
}

interface UsePlaylistReturns
  extends ReturnType<typeof useAudio>,
    ReturnType<typeof usePlayingAudio> {
  playlist: Playlist;
  addAudio: (audio: ArrayElementType<Playlist>, autoplay?: boolean) => void;
  removeAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
  clearPlaylist: () => void;
}

const usePlaylist = ({
  playlist: initPlaylist = PLAYLIST_DEFAULT_VALUE.playlist,
  repeatMode = PLAYLIST_DEFAULT_VALUE.repeatMode,
  ...useAudioParams
}: UsePlaylistParams): UsePlaylistReturns => {
  const [playlist, setPlaylist] = useState(initPlaylist);

  const { audioRef, changeCurrentSrc, resetAudio, togglePlayPause, ...useAudioReturns } = useAudio({
    ...useAudioParams,
    loop: repeatMode === 'one',
  });

  const { playingId, changePlayingAudio, ...usePlayingAudioReturns } = usePlayingAudio({
    playlist,
    changeCurrentSrc,
    resetAudio,
    togglePlayPause,
  });

  usePlaylistEndedEvent({
    audioRef,
    playingId,
    playlist,
    repeatMode,
    changePlayingAudio,
  });

  const addAudio = useCallback(
    (audio: ArrayElementType<Playlist>, autoplay = false): void => {
      setPlaylist(prev => [...prev, audio]);

      if (autoplay) {
        changePlayingAudio(audio.id, autoplay);
      }
    },
    [changePlayingAudio],
  );

  const removeAudio = useCallback(
    (id: ArrayElementType<Playlist>['id'], autoplay = false): void => {
      setPlaylist(prev => prev.filter(audio => audio.id !== id));

      if (playingId !== id) return;

      if (autoplay && playlist.length > 1) {
        const removedAudioIndex = findArrayElementById({ array: playlist, id, returnIndex: true });

        if (removedAudioIndex === undefined || removedAudioIndex < 0) return;

        const targetAudio =
          playlist[removedAudioIndex >= playlist.length - 1 ? 0 : removedAudioIndex + 1];

        changePlayingAudio(targetAudio.id, autoplay);
        return;
      }

      changePlayingAudio('');
    },
    [changePlayingAudio, playingId, playlist],
  );

  const clearPlaylist = useCallback((): void => {
    setPlaylist([]);
  }, []);

  return {
    audioRef,
    playingId,
    playlist,
    addAudio,
    changeCurrentSrc,
    changePlayingAudio,
    clearPlaylist,
    removeAudio,
    resetAudio,
    togglePlayPause,
    ...useAudioReturns,
    ...usePlayingAudioReturns,
  };
};

export default usePlaylist;
