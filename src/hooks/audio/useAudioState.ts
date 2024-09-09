import { useEffect, useRef, useState, type MutableRefObject } from 'react';

import { DEFAULT_UNMUTE_VOLUME } from './_constants';

interface UseAudioStateParams {
  audioRef: MutableRefObject<HTMLAudioElement>;
  maxPlaybackRange: number;
  maxVolume: number;
}

export interface UseAudioStateReturns {
  currentSrc: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRange: number;
  volume: number;
}

const useAudioState = ({
  audioRef,
  maxPlaybackRange,
  maxVolume,
}: UseAudioStateParams): UseAudioStateReturns => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playbackRange, setPlaybackRange] = useState(0);
  const [volume, setVolume] = useState(maxVolume);

  const prevVolumeRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioMetadataLoaded = (): void => {
      setCurrentSrc(audio.currentSrc);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setPlaybackRange((audio.currentTime / audio.duration) * maxPlaybackRange);
    };

    const onAudioTimeUpdate = (): void => {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * maxPlaybackRange;

      setCurrentTime(audioRef.current.currentTime);
      setPlaybackRange(isNaN(progress) ? 0 : progress);
    };

    audio.addEventListener('loadedmetadata', onAudioMetadataLoaded);
    audio.addEventListener('timeupdate', onAudioTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', onAudioMetadataLoaded);
      audio.removeEventListener('timeupdate', onAudioTimeUpdate);
    };
  }, [audioRef, maxPlaybackRange]);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioPlay = (): void => {
      setIsPlaying(true);
    };

    const onAudioPause = (): void => {
      setIsPlaying(false);
    };

    const onAudioEnded = (): void => {
      setIsPlaying(false);
    };

    audio.addEventListener('play', onAudioPlay);
    audio.addEventListener('pause', onAudioPause);
    audio.addEventListener('ended', onAudioEnded);

    return () => {
      audio.removeEventListener('play', onAudioPlay);
      audio.removeEventListener('pause', onAudioPause);
      audio.removeEventListener('ended', onAudioEnded);
    };
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioVolumeChange = (): void => {
      setVolume(audioRef.current.volume * maxVolume);

      if (muted === audioRef.current.muted) return;

      setMuted(audioRef.current.muted);

      if (audioRef.current.muted) {
        prevVolumeRef.current = volume;
        setVolume(0);
        return;
      }

      setVolume(
        audioRef.current.volume > 0
          ? audioRef.current.volume * maxVolume
          : DEFAULT_UNMUTE_VOLUME * maxVolume,
      );
      prevVolumeRef.current = 0;
    };

    audio.addEventListener('volumechange', onAudioVolumeChange);

    return () => {
      audio.removeEventListener('volumechange', onAudioVolumeChange);
    };
  }, [audioRef, maxVolume, muted, volume]);

  return {
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    playbackRange,
    volume,
  };
};

export default useAudioState;
