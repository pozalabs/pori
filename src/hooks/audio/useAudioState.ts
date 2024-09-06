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
  playbackRate: number;
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
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progressTime, setProgressTime] = useState(0);
  const [volume, setVolume] = useState(maxProgressVolume);

  const prevVolumeRef = useRef(0);
  const currentTimeIdRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioMetadataLoaded = (): void => {
      setCurrentSrc(audio.currentSrc);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgressTime((audio.currentTime / audio.duration) * maxProgressTime);
    };

    const updateCurrentTime = () => {
      const progress = (audio.currentTime / audio.duration) * maxProgressTime;

      setCurrentTime(Number(audio.currentTime.toFixed(2)));
      setProgressTime(isNaN(progress) ? 0 : progress);

      currentTimeIdRef.current = requestAnimationFrame(updateCurrentTime);
    };

    const onAudioPlay = (): void => {
      setIsPlaying(true);
      currentTimeIdRef.current = requestAnimationFrame(updateCurrentTime);
    };

    const onAudioPause = (): void => {
      setIsPlaying(false);
      cancelAnimationFrame(currentTimeIdRef.current);
      currentTimeIdRef.current = 0;
    };

    const onAudioEnded = (): void => {
      setIsPlaying(false);
      cancelAnimationFrame(currentTimeIdRef.current);
      currentTimeIdRef.current = 0;
    };

    const onAudioSeeked = (): void => {
      const progress = (audio.currentTime / audio.duration) * maxProgressTime;

      setCurrentTime(audio.currentTime);
      setProgressTime(isNaN(progress) ? 0 : progress);
    };

    audio.addEventListener('loadedmetadata', onAudioMetadataLoaded);
    audio.addEventListener('play', onAudioPlay);
    audio.addEventListener('pause', onAudioPause);
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('seeked', onAudioSeeked);

    return () => {
      audio.removeEventListener('loadedmetadata', onAudioMetadataLoaded);
      audio.removeEventListener('play', onAudioPlay);
      audio.removeEventListener('pause', onAudioPause);
      audio.removeEventListener('ended', onAudioEnded);
      audio.removeEventListener('seeked', onAudioSeeked);
    };
  }, [audioRef, maxProgressTime]);

  useEffect(() => {
    const audio = audioRef.current;

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

    audio.addEventListener('volumechange', onAudioVolumeChange);

    return () => {
      audio.removeEventListener('volumechange', onAudioVolumeChange);
    };
  }, [audioRef, maxProgressVolume, muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioRateChange = (): void => {
      setPlaybackRate(audio.playbackRate);
    };

    audio.addEventListener('ratechange', onAudioRateChange);

    return () => {
      audio.removeEventListener('ratechange', onAudioRateChange);
    };
  }, [audioRef]);

  return {
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    playbackRate,
    progressTime,
    volume,
  };
};

export default useAudioState;
