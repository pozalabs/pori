export type RepeatModeType = 'all' | 'one' | 'none';

export type Playlist = Array<{
  id: string;
  src: string;
  [key: string]: unknown;
}>;
