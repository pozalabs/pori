export type RepeatModeType = 'all' | 'one' | 'none';

interface Audio {
  id: string;
  src: string;
  [key: string]: unknown;
}

export type Playlist = Audio[];
