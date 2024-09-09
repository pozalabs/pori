import { useCallback, useEffect } from 'react';

interface UseKeyboardControlParams {
  enabled: boolean;
  preventDefault: boolean;
  duration: number;
  isPlaying: boolean;
  changeCurrentTime: (currentTime: number) => void;
  shiftTimeBackward: () => void;
  shiftTimeForward: () => void;
  toggleMuted: () => void;
  togglePlayPause: () => void;
}

const useKeyboardControl = ({
  enabled,
  preventDefault,
  duration,
  isPlaying,
  changeCurrentTime,
  shiftTimeBackward,
  shiftTimeForward,
  toggleMuted,
  togglePlayPause,
}: UseKeyboardControlParams) => {
  const shiftTime = useCallback(
    (key: 'ArrowLeft' | 'ArrowRight', shiftKey: boolean): void => {
      const targetCurrentTime = key === 'ArrowLeft' ? 0 : duration;

      if (shiftKey) {
        changeCurrentTime(targetCurrentTime);
        return;
      }

      (key === 'ArrowLeft' ? shiftTimeForward : shiftTimeBackward)();
    },
    [changeCurrentTime, duration, shiftTimeBackward, shiftTimeForward],
  );

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowRight': {
          if (!isPlaying) return;
          shiftTime(e.key, e.shiftKey);
          return;
        }
        case ' ': {
          togglePlayPause();
          return;
        }
        case 'm': {
          if (!isPlaying) return;
          toggleMuted();
          return;
        }
      }
    };

    document.body.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.removeEventListener('keydown', onKeyDown);
    };
  }, [
    changeCurrentTime,
    duration,
    enabled,
    isPlaying,
    preventDefault,
    shiftTime,
    shiftTimeBackward,
    shiftTimeForward,
    toggleMuted,
    togglePlayPause,
  ]);
};

export default useKeyboardControl;
