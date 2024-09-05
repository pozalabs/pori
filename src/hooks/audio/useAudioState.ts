import { useEffect, useRef, useState, type MutableRefObject } from 'react';

import { DEFAULT_UNMUTE_VOLUME } from './_constants';

interface UseAudioStateParams {
  audioRef: MutableRefObject<HTMLAudioElement>;
  maxProgressTime: number;
  maxProgressVolume: number;
}

export interface UseAudioStateReturns {
  currentSrc: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  progressTime: number;
  volume: number;
}

const useAudioState = ({
  audioRef,
  maxProgressTime,
  maxProgressVolume,
}: UseAudioStateParams): UseAudioStateReturns => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progressTime, setProgressTime] = useState(0);
  const [volume, setVolume] = useState(maxProgressVolume);

  const prevVolumeRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioMetadataLoaded = (): void => {
      setCurrentSrc(audio.currentSrc);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgressTime((audio.currentTime / audio.duration) * maxProgressTime);
    };

    const onAudioPlay = (): void => {
      setIsPlaying(true);
    };

    const onAudioPause = (): void => {
      setIsPlaying(false);
    };

    const onAudioEnded = (): void => {
      setIsPlaying(false);
    };

    const onAudioVolumeChange = (): void => {
      setVolume(audioRef.current.volume * maxProgressVolume);

      if (muted === audioRef.current.muted) return;

      setMuted(audioRef.current.muted);

      if (audioRef.current.muted) {
        prevVolumeRef.current = volume;
        setVolume(0);
        return;
      }

      setVolume(
        audioRef.current.volume > 0
          ? audioRef.current.volume * maxProgressVolume
          : DEFAULT_UNMUTE_VOLUME * maxProgressVolume,
      );
      prevVolumeRef.current = 0;
    };

    const onAudioTimeUpdate = (): void => {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * maxProgressTime;

      setCurrentTime(audioRef.current.currentTime);
      setProgressTime(isNaN(progress) ? 0 : progress);
    };

    audio.addEventListener('loadedmetadata', onAudioMetadataLoaded);
    audio.addEventListener('play', onAudioPlay);
    audio.addEventListener('pause', onAudioPause);
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('volumechange', onAudioVolumeChange);
    audio.addEventListener('timeupdate', onAudioTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', onAudioMetadataLoaded);
      audio.removeEventListener('play', onAudioPlay);
      audio.removeEventListener('pause', onAudioPause);
      audio.removeEventListener('ended', onAudioEnded);
      audio.removeEventListener('volumechange', onAudioVolumeChange);
      audio.removeEventListener('timeupdate', onAudioTimeUpdate);
    };
  }, [audioRef, isPlaying, maxProgressTime, maxProgressVolume, muted, volume]);

  return {
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    progressTime,
    volume,
  };
};

export default useAudioState;
