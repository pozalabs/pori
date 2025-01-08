import type { AudioPlayerTimeFormat } from '../../../types';

const formatTime = (time: number, format: AudioPlayerTimeFormat) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const pad = (num: number) => String(num).padStart(2, '0');

  switch (format) {
    case 'SS':
    case 'S':
      return String(time).padStart(format === 'SS' ? 2 : 1, '0');
    case 'MM:SS':
      return `${pad(Math.floor(time / 60))}:${pad(seconds)}`;
    case 'M:S':
      return `${Math.floor(time / 60)}:${seconds}`;
    case 'HH:MM:SS':
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    case 'H:M:S':
      return `${hours}:${minutes}:${seconds}`;
  }
};

export default formatTime;
