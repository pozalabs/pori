import { useEffect, useRef, useState, type MutableRefObject } from 'react';

import Hls from 'hls.js';

import { DEFAULT_UNMUTE_VOLUME } from './_constants';
import type { UseAudioStateReturns } from '../../types';

interface UseAudioStateParams {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  hlsRef: MutableRefObject<Hls | null>;
  isAudioInitialized: boolean;
  maxPlaybackRange: number;
  maxVolume: number;
}

const useAudioState = ({
  audioRef,
  hlsRef,
  isAudioInitialized,
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

    if (!audio || !isAudioInitialized) return;

    const onAudioLoadStart = (): void => {
      if (
        audio.currentSrc.substring(audio.currentSrc.lastIndexOf('.') + 1) !== 'm3u8' ||
        !Hls.isSupported()
      )
        return;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(audio.currentSrc);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!audioRef.current?.dataset.shouldPlay) return;

        audioRef.current?.play();
        audioRef.current.dataset.shouldPlay = '';
      });
    };

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

    audio.addEventListener('loadstart', onAudioLoadStart);
    audio.addEventListener('loadedmetadata', onAudioMetadataLoaded);
    audio.addEventListener('play', onAudioPlay);
    audio.addEventListener('pause', onAudioPause);
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('seeked', onAudioSeeked);

    return () => {
      audio.removeEventListener('loadstart', onAudioLoadStart);
      audio.removeEventListener('loadedmetadata', onAudioMetadataLoaded);
      audio.removeEventListener('play', onAudioPlay);
      audio.removeEventListener('pause', onAudioPause);
      audio.removeEventListener('ended', onAudioEnded);
      audio.removeEventListener('seeked', onAudioSeeked);
    };
  }, [audioRef, currentSrc, hlsRef, isAudioInitialized, maxPlaybackRange]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !isAudioInitialized) return;

    const onAudioVolumeChange = (): void => {
      setVolume(audio.volume * maxVolume);

      if (muted === audio.muted) return;

      setMuted(audio.muted);

      if (audio.muted) {
        prevVolumeRef.current = volume;
        setVolume(0);
        return;
      }

      setVolume(audio.volume > 0 ? audio.volume * maxVolume : DEFAULT_UNMUTE_VOLUME * maxVolume);
      prevVolumeRef.current = 0;
    };

    audio.addEventListener('volumechange', onAudioVolumeChange);

    return () => {
      audio.removeEventListener('volumechange', onAudioVolumeChange);
    };
  }, [audioRef, isAudioInitialized, maxVolume, muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !isAudioInitialized) return;

    const onAudioRateChange = (): void => {
      setPlaybackRate(audio.playbackRate);
    };

    const onAudioError = (): void => {
      setCurrentSrc('');
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setPlaybackRange(0);
    };

    audio.addEventListener('ratechange', onAudioRateChange);
    audio.addEventListener('error', onAudioError);

    return () => {
      audio.removeEventListener('ratechange', onAudioRateChange);
      audio.removeEventListener('error', onAudioError);
    };
  }, [audioRef, isAudioInitialized]);

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
