import { useAudio, useControlAudio } from '@pozalabs/pokit';

interface UseWaveformAudioParams {
  src: string;
  autoplay: boolean;
}

interface UseWaveformAudioReturns {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  changeCurrentTime: (currentTime: number) => void;
}

const useWaveformAudio = ({ src, autoplay }: UseWaveformAudioParams): UseWaveformAudioReturns => {
  const audioRef = useAudio();
  const [{ isPlaying, currentTime, duration }, { play, pause, changeCurrentTime }] =
    useControlAudio({
      audioRef,
      src,
      autoPlay: autoplay,
    });

  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    changeCurrentTime,
  };
};

export default useWaveformAudio;
