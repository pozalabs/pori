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
  playbackRate: number;
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
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playbackRange, setPlaybackRange] = useState(0);
  const [volume, setVolume] = useState(maxVolume);

  const prevVolumeRef = useRef(0);
  const currentTimeRAFIdRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioMetadataLoaded = (): void => {
      setCurrentSrc(audio.currentSrc);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setPlaybackRange((audio.currentTime / audio.duration) * maxPlaybackRange);
    };

    const updateCurrentTime = () => {
      const progress = (audio.currentTime / audio.duration) * maxPlaybackRange;

      setCurrentTime(Number(audio.currentTime.toFixed(2)));
      setPlaybackRange(isNaN(progress) ? 0 : progress);

      currentTimeRAFIdRef.current = requestAnimationFrame(updateCurrentTime);
    };

    const onAudioPlay = (): void => {
      setIsPlaying(true);
      currentTimeRAFIdRef.current = requestAnimationFrame(updateCurrentTime);
    };

    const onAudioPause = (): void => {
      setIsPlaying(false);
      cancelAnimationFrame(currentTimeRAFIdRef.current);
      currentTimeRAFIdRef.current = 0;
    };

    const onAudioEnded = (): void => {
      setIsPlaying(false);
      cancelAnimationFrame(currentTimeRAFIdRef.current);
      currentTimeRAFIdRef.current = 0;
    };

    const onAudioSeeked = (): void => {
      const progress = (audio.currentTime / audio.duration) * maxPlaybackRange;

      setCurrentTime(audio.currentTime);
      setPlaybackRange(isNaN(progress) ? 0 : progress);
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
  }, [audioRef, maxPlaybackRange]);

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

  useEffect(() => {
    const audio = audioRef.current;

    const onAudioRateChange = (): void => {
      setPlaybackRate(audio.playbackRate);
    };

    const onAudioEmptied = (): void => {
      setCurrentSrc('');
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setPlaybackRange(0);
    };

    audio.addEventListener('ratechange', onAudioRateChange);
    audio.addEventListener('emptied', onAudioEmptied);

    return () => {
      audio.removeEventListener('ratechange', onAudioRateChange);
      audio.removeEventListener('emptied', onAudioEmptied);
    };
  }, [audioRef]);

  return {
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    playbackRate,
    playbackRange,
    volume,
  };
};

export default useAudioState;
