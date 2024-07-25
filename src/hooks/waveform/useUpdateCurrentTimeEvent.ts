import { useRef } from 'react';

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
  const isDraggingRef = useRef(false);

  const updateCurrentTime = (e: MouseEvent): void => {
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
  };

  const onElementClick = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return;

    updateCurrentTime(e);
  };
  const onElementMouseDown = (): void => {
    isDraggingRef.current = true;
  };
  const onElementMouseUp = (): void => {
    isDraggingRef.current = false;
  };
  const onElementMouseMove = (e: Event): void => {
    if (!(e instanceof MouseEvent) || !isDraggingRef.current) return;

    updateCurrentTime(e);
  };
  const onElementDragStart = (e: Event): void => e.preventDefault();

  const addEventListeners = (
    element: HTMLCanvasElement | HTMLImageElement,
  ): void => {
    element.addEventListener('click', onElementClick);
    element.addEventListener('mousedown', onElementMouseDown);
    element.addEventListener('mouseup', onElementMouseUp);
    element.addEventListener('mousemove', onElementMouseMove);
    element.addEventListener('dragstart', onElementDragStart);
  };

  const removeEventListeners = (
    element: HTMLCanvasElement | HTMLImageElement,
  ): void => {
    element.removeEventListener('click', onElementClick);
    element.removeEventListener('mousedown', onElementMouseDown);
    element.removeEventListener('mouseup', onElementMouseUp);
    element.removeEventListener('mousemove', onElementMouseMove);
    element.removeEventListener('dragstart', onElementDragStart);
  };

  return {
    addEventListeners,
    removeEventListeners,
  };
};

export default useUpdateCurrentTimeEvent;
