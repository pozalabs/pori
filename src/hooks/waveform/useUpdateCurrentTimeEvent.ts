import { useCallback } from 'react';

interface UseUpdateCurrentTimeEventParams {
  duration: number;
  showHoveredWaveform: (e: Event) => void;
  hideHoveredWaveform: () => void;
  changeCurrentTime?: (currentTime: number) => void;
}

interface UseUpdateCurrentTimeEventReturns {
  addEventListeners: (element: HTMLCanvasElement | HTMLImageElement) => void;
  removeEventListeners: (element: HTMLCanvasElement | HTMLImageElement) => void;
}

const useUpdateCurrentTimeEvent = ({
  duration,
  showHoveredWaveform,
  hideHoveredWaveform,
  changeCurrentTime,
}: UseUpdateCurrentTimeEventParams): UseUpdateCurrentTimeEventReturns => {
  const onElementClick = useCallback(
    (e: Event): void => {
      if (!(e instanceof MouseEvent)) return;
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

  const addEventListeners = useCallback(
    (element: HTMLCanvasElement | HTMLImageElement): void => {
      element.addEventListener('click', onElementClick);
      element.addEventListener('mousemove', showHoveredWaveform);
      element.addEventListener('mouseout', hideHoveredWaveform);
    },
    [onElementClick, showHoveredWaveform, hideHoveredWaveform],
  );

  const removeEventListeners = useCallback(
    (element: HTMLCanvasElement | HTMLImageElement): void => {
      element.removeEventListener('click', onElementClick);
      element.removeEventListener('mousemove', showHoveredWaveform);
      element.removeEventListener('mouseout', hideHoveredWaveform);
    },
    [onElementClick, showHoveredWaveform, hideHoveredWaveform],
  );

  return {
    addEventListeners,
    removeEventListeners,
  };
};

export default useUpdateCurrentTimeEvent;
