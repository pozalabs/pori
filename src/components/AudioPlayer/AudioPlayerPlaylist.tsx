import type { ReactNode } from 'react';
import { useContext } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import { AudioPlayerContext } from './AudioPlayerProvider';
import type { Playlist } from '../../hooks';

export interface AudioPlayerPlaylistProps {
  renderItem: (audio: ArrayElementType<Playlist>, index?: number) => ReactNode;
  className?: string;
}

const AudioPlayerPlaylist = ({ renderItem, className }: AudioPlayerPlaylistProps) => {
  const { playlist } = useContext(AudioPlayerContext);

  return <ul className={className}>{playlist.map((audio, index) => renderItem(audio, index))}</ul>;
};

export default AudioPlayerPlaylist;
