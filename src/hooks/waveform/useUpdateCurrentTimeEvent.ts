import { useCallback, useRef } from 'react';

interface UseUpdateCurrentTimeEventParams {
  duration: number;
  showPlayhead: (e: Event) => void;
  hidePlayhead: () => void;
  changeCurrentTime?: (currentTime: number) => void;
}

interface UseUpdateCurrentTimeEventReturns {
  addEventListeners: (element: HTMLCanvasElement | HTMLImageElement) => void;
  removeEventListeners: (element: HTMLCanvasElement | HTMLImageElement) => void;
}

const useUpdateCurrentTimeEvent = ({
  duration,
  showPlayhead,
  hidePlayhead,
  changeCurrentTime,
}: UseUpdateCurrentTimeEventParams): UseUpdateCurrentTimeEventReturns => {
  const isDraggingRef = useRef(false);

  const updateCurrentTime = useCallback(
    (e: MouseEvent): void => {
      if (
        !(e.target instanceof HTMLCanvasElement || e.target instanceof HTMLImageElement) ||
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

  const onElementClick = useCallback(
    (e: Event): void => {
      if (!(e instanceof MouseEvent)) return;

      updateCurrentTime(e);
    },
    [updateCurrentTime],
  );

  const addEventListeners = useCallback(
    (element: HTMLCanvasElement | HTMLImageElement): void => {
      element.addEventListener('click', onElementClick);
      element.addEventListener('mousemove', showPlayhead);
      element.addEventListener('mouseout', hidePlayhead);
    },
    [onElementClick, showPlayhead, hidePlayhead],
  );

  const removeEventListeners = useCallback(
    (element: HTMLCanvasElement | HTMLImageElement): void => {
      element.removeEventListener('click', onElementClick);
      element.removeEventListener('mousemove', showPlayhead);
      element.removeEventListener('mouseout', hidePlayhead);
    },
    [onElementClick, showPlayhead, hidePlayhead],
  );

  return {
    addEventListeners,
    removeEventListeners,
  };
};

export default useUpdateCurrentTimeEvent;
