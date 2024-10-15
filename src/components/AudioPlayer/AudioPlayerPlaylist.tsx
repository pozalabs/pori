import type { HTMLAttributes, ReactNode } from 'react';
import { useContext } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import { AudioPlayerContext } from './AudioPlayerProvider';
import type { Playlist } from '../../hooks';

export interface AudioPlayerPlaylistProps extends HTMLAttributes<HTMLUListElement> {
  renderItem: (audio: ArrayElementType<Playlist>, index?: number) => ReactNode;
}

const AudioPlayerPlaylist = ({ renderItem, ...ulProps }: AudioPlayerPlaylistProps) => {
  const { playlist } = useContext(AudioPlayerContext);

  return <ul {...ulProps}>{playlist.map((audio, index) => renderItem(audio, index))}</ul>;
};

export default AudioPlayerPlaylist;
