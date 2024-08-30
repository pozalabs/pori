import { useCallback } from 'react';

interface UseUpdateCurrentTimeEventParams {
  duration: number;
  showHoveredWaveform: (e: Event) => void;
  hideHoveredWaveform: () => void;
  changeCurrentTime?: (currentTime: number) => void;
}

interface UseUpdateCurrentTimeEventReturns {
  addEventListeners: (element: HTMLCanvasElement | SVGSVGElement) => void;
  removeEventListeners: (element: HTMLCanvasElement | SVGSVGElement) => void;
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
        !(
          e.currentTarget instanceof HTMLCanvasElement || e.currentTarget instanceof SVGSVGElement
        ) ||
        !changeCurrentTime
      )
        return;

      const rect = e.currentTarget.getBoundingClientRect();

      const targetWidth = rect.width;
      const clickX = e.clientX - rect.left;
      const percent = (clickX / targetWidth) * 100;
      const newCurrentTime = (percent * duration) / 100;

      changeCurrentTime(newCurrentTime);
    },
    [duration, changeCurrentTime],
  );

  const addEventListeners = useCallback(
    (element: HTMLCanvasElement | SVGSVGElement): void => {
      element.addEventListener('click', onElementClick);
      element.addEventListener('mousemove', showHoveredWaveform);
      element.addEventListener('mouseleave', hideHoveredWaveform);
    },
    [onElementClick, showHoveredWaveform, hideHoveredWaveform],
  );

  const removeEventListeners = useCallback(
    (element: HTMLCanvasElement | SVGSVGElement): void => {
      element.removeEventListener('click', onElementClick);
      element.removeEventListener('mousemove', showHoveredWaveform);
      element.removeEventListener('mouseleave', hideHoveredWaveform);
    },
    [onElementClick, showHoveredWaveform, hideHoveredWaveform],
  );

  return {
    addEventListeners,
    removeEventListeners,
  };
};

export default useUpdateCurrentTimeEvent;
