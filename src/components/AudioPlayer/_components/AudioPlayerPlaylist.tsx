import { useContext } from 'react';

import { AudioPlayerContext } from './AudioPlayerProvider';
import type { AudioPlayerPlaylistProps } from '../../../types';

/** Renders the playlist using a custom render function for each item. */
const AudioPlayerPlaylist = ({ renderItem, ...ulProps }: AudioPlayerPlaylistProps) => {
  const { playlist } = useContext(AudioPlayerContext);

  return <ul {...ulProps}>{playlist.map((audio, index) => renderItem(audio, index))}</ul>;
};

export default AudioPlayerPlaylist;
