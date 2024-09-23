import type { Playlist, RepeatModeType } from '../_types';

interface IPlaylistDefaultValue {
  playlist: Playlist;
  repeatMode: RepeatModeType;
}

export const PLAYLIST_DEFAULT_VALUE: IPlaylistDefaultValue = {
  playlist: [],
  repeatMode: 'none',
};
