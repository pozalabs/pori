import type { ReactNode } from 'react';
import { useContext } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import { AudioPlayerContext } from './AudioPlayerProvider';
import type { Playlist } from '../../hooks';

interface AudioPlayerPlaylistProps {
  renderItem: (audio: ArrayElementType<Playlist>) => ReactNode;
  className?: string;
}

const AudioPlayerPlaylist = ({ renderItem, className }: AudioPlayerPlaylistProps) => {
  const { playlist } = useContext(AudioPlayerContext);

  return <ul className={className}>{playlist.map(audio => renderItem(audio))}</ul>;
};

export default AudioPlayerPlaylist;
