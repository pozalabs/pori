import { useState } from 'react';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import type { Playlist, RepeatModeType } from './_types';
import useAudio from '../audio/useAudio';

interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
  playlist?: Playlist;
  repeatMode?: RepeatModeType;
}

interface UsePlaylistReturns extends ReturnType<typeof useAudio> {
  playlist: Playlist;
}

const usePlaylist = ({
  playlist: initPlaylist = PLAYLIST_DEFAULT_VALUE.playlist,
  repeatMode = PLAYLIST_DEFAULT_VALUE.repeatMode,
  ...useAudioParams
}: UsePlaylistParams): UsePlaylistReturns => {
  const [playlist, setPlaylist] = useState(initPlaylist);

  const { ...useAudioReturns } = useAudio({ ...useAudioParams });

  return {
    playlist,
    ...useAudioReturns,
  };
};

export default usePlaylist;
