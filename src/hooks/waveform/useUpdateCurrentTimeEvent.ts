import { useCallback, useRef } from 'react';

interface UseUpdateCurrentTimeEventParams {
  duration: number;
  changeCurrentTime?: (currentTime: number) => void;
}

interface UseUpdateCurrentTimeEventReturns {
  addEventListeners: (element: HTMLCanvasElement | HTMLImageElement) => void;
  removeEventListeners: (element: HTMLCanvasElement | HTMLImageElement) => void;
}

const useUpdateCurrentTimeEvent = ({
  duration,
  changeCurrentTime,
}: UseUpdateCurrentTimeEventParams): UseUpdateCurrentTimeEventReturns => {
  const onElementClick = useCallback(
    (e: Event): void => {
      if (!(e instanceof MouseEvent)) return;
      if (
        !(
          e.target instanceof HTMLCanvasElement ||
          e.target instanceof HTMLImageElement
        ) ||
        !changeCurrentTime
      )
        return;

      const rect = e.target.getBoundingClientRect();

      const targetWidth = rect.width;
      const clickX = e.clientX - rect.left;
      const percent = (clickX / targetWidth) * 100;
      const newCurrentTime = (percent * duration) / 100;

      changeCurrentTime(newCurrentTime);
    },
    [duration, changeCurrentTime],
  );

  const addEventListeners = useCallback(
    (element: HTMLCanvasElement | HTMLImageElement): void => {
      element.addEventListener('click', onElementClick);
    },
    [onElementClick],
  );

  const removeEventListeners = useCallback(
    (element: HTMLCanvasElement | HTMLImageElement): void => {
      element.removeEventListener('click', onElementClick);
    },
    [onElementClick],
  );

  return {
    addEventListeners,
    removeEventListeners,
  };
};

export default useUpdateCurrentTimeEvent;
