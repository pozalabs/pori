
import { ChangeEvent, MutableRefObject, useCallback, useEffect, useState } from "react";

interface UseControlAudioVolumeParams {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  progressMaxValue: number;
}

interface UseControlAudioVolumeReturns {
  currentVolume: number;
  onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleMute: VoidFunction;
}

/**
 * audio 볼륨을 제어하는 hook입니다.
 * @param UseControlAudioVolumeParams
 * ```
 * interface UseControlAudioVolumeParams {
 *   audioRef: MutableRefObject<HTMLAudioElement | null>;
 *   progressMaxValue: number;
 * }
 * ```
 * @returns
 * `UseControlAudioVolumeReturns`
 * ```
 * interface UseControlAudioVolumeReturns {
 *   currentVolume: number;
 *   onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 *   toggleMute: VoidFunction;
 * }
 * ```
 */
const useControlAudioVolume = ({
  audioRef,
  progressMaxValue,
}: UseControlAudioVolumeParams): UseControlAudioVolumeReturns => {
  const [currentVolume, setCurrentVolume] = useState(100);
  const [previousVolume, setPreviousVolume] = useState(100);

  useEffect(() => {
    if (!audioRef.current) return;

    setCurrentVolume(audioRef.current.volume * progressMaxValue);
  }, [audioRef.current]);

  const onVolumeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!audioRef.current || !audioRef.current.src) return;

      setPreviousVolume(currentVolume);
      const newCurrentVolume = Number(e.target.value) / progressMaxValue;
      audioRef.current.volume = newCurrentVolume;
      setCurrentVolume(newCurrentVolume * progressMaxValue);
    },
    [audioRef.current, currentVolume],
  );

  const toggleMute = useCallback(() => {
    if (!audioRef.current || !audioRef.current.src) return;

    if (audioRef.current.volume === 0) {
      audioRef.current.volume = previousVolume / progressMaxValue;
      setCurrentVolume(previousVolume);
      return;
    }

    setPreviousVolume(currentVolume);
    audioRef.current.volume = 0;
    setCurrentVolume(0);
  }, [audioRef.current, currentVolume, previousVolume]);

  return {
    currentVolume,
    onVolumeChange,
    toggleMute,
  };
};

export default useControlAudioVolume;
