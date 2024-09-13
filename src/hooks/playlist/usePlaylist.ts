import { useCallback, useEffect, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import type { Playlist, RepeatModeType } from './_types';
import usePlayingAudio from './usePlayingAudio';
import useAudio from '../audio/useAudio';

interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
  playlist?: Playlist;
  repeatMode?: RepeatModeType;
}

interface UsePlaylistReturns
  extends ReturnType<typeof useAudio>,
    ReturnType<typeof usePlayingAudio> {
  playlist: Playlist;
  addAudio: (audio: ArrayElementType<Playlist>) => void;
  removeAudio: (id: ArrayElementType<Playlist>['id']) => void;
  clearPlaylist: () => void;
}

const usePlaylist = ({
  playlist: initPlaylist = PLAYLIST_DEFAULT_VALUE.playlist,
  repeatMode = PLAYLIST_DEFAULT_VALUE.repeatMode,
  ...useAudioParams
}: UsePlaylistParams): UsePlaylistReturns => {
  const [playlist, setPlaylist] = useState(initPlaylist);

  const { audioRef, resetAudio, togglePlayPause, ...useAudioReturns } = useAudio({
    ...useAudioParams,
    loop: repeatMode === 'one',
  });

  const { playingId, changePlayingAudio } = usePlayingAudio({
    playlist,
    resetAudio,
    togglePlayPause,
  });

  const addAudio = useCallback((audio: ArrayElementType<Playlist>): void => {
    setPlaylist(prev => [...prev, audio]);
  }, []);

  const removeAudio = useCallback((id: ArrayElementType<Playlist>['id']): void => {
    setPlaylist(prev => prev.filter(audio => audio.id !== id));
  }, []);

  const clearPlaylist = useCallback((): void => {
    setPlaylist([]);
  }, []);

  useEffect(() => {
    if (playlist.length <= 0 || playingId) return;

    changePlayingAudio(playlist[0].id);
  }, [changePlayingAudio, playingId, playlist]);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioEnded = (): void => {
      const playingAudioIndex = playlist.findIndex(audio => audio.id === playingId);

      if (playingAudioIndex < 0) return;

      if (playingAudioIndex >= playlist.length - 1) {
        if (repeatMode === 'all') {
          changePlayingAudio(playlist[0].id);
        }
        return;
      }

      changePlayingAudio(playlist[playingAudioIndex + 1].id);
    };

    audio.addEventListener('ended', onAudioEnded);

    return () => {
      audio.removeEventListener('ended', onAudioEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef, playingId, repeatMode]);

  return {
    audioRef,
    playingId,
    playlist,
    addAudio,
    changePlayingAudio,
    clearPlaylist,
    removeAudio,
    resetAudio,
    togglePlayPause,
    ...useAudioReturns,
  };
};

export default usePlaylist;
