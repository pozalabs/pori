import { useCallback, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import type { Playlist, RepeatModeType } from './_types';
import useAudio from '../audio/useAudio';

interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
  playlist?: Playlist;
  repeatMode?: RepeatModeType;
}

interface UsePlaylistReturns extends ReturnType<typeof useAudio> {
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

  const { ...useAudioReturns } = useAudio({ ...useAudioParams, loop: repeatMode === 'one' });

  const addAudio = useCallback((audio: ArrayElementType<Playlist>): void => {
    setPlaylist(prev => [...prev, audio]);
  }, []);

  const removeAudio = useCallback((id: ArrayElementType<Playlist>['id']): void => {
    setPlaylist(prev => prev.filter(audio => audio.id !== id));
  }, []);

  const clearPlaylist = useCallback((): void => {
    setPlaylist([]);
  }, []);

  return {
    playlist,
    addAudio,
    removeAudio,
    clearPlaylist,
    ...useAudioReturns,
  };
};

export default usePlaylist;
