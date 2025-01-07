import { getByTestId, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Slider from '.';

const value = 10;
const max = 55;

describe('Slider component rendering test', () => {
  describe('When slider is horizontal', () => {
    it('track length is the value of value / max converted to percent.', () => {
      const { container } = render(<Slider orientation="horizontal" value={value} max={max} />);

      const trackElement = getByTestId(container, 'sliderTrack');

      expect(trackElement).toBeDefined();
      expect(trackElement.style.width).toBe(`${(value / max) * 100}%`);
    });

    it('The thumb is located at the horizontal end of the track.', () => {
      const { container: horizontalSliderContainer } = render(
        <Slider orientation="horizontal" value={value} max={max} />,
      );

      const horizontalSliderThumbElement = getByTestId(horizontalSliderContainer, 'sliderThumb');

      expect(horizontalSliderThumbElement).toBeDefined();
      expect(horizontalSliderThumbElement.style.left).toBe(`${(value / max) * 100}%`);

      const { container: horizontalReverseSliderContainer } = render(
        <Slider orientation="horizontal-reverse" value={value} max={max} />,
      );

      const horizontalReverseSliderThumbElement = getByTestId(
        horizontalReverseSliderContainer,
        'sliderThumb',
      );

      expect(horizontalReverseSliderThumbElement).toBeDefined();
      expect(horizontalReverseSliderThumbElement.style.left).toBe(`${100 - (value / max) * 100}%`);
    });
  });

  describe('When slider is vertical', () => {
    it('The height of the track is value / max converted to percent.', () => {
      const { container } = render(<Slider orientation="vertical" value={value} max={max} />);

      const trackElement = getByTestId(container, 'sliderTrack');

      expect(trackElement).toBeDefined();
      expect(trackElement.style.height).toBe(`${(value / max) * 100}%`);
    });

    it('The thumb is located at the vertical end of the track.', () => {
      const { container: verticalSliderContainer } = render(
        <Slider orientation="vertical" value={value} max={max} />,
      );

      const verticalSliderThumbElement = getByTestId(verticalSliderContainer, 'sliderThumb');

      expect(verticalSliderThumbElement).toBeDefined();
      expect(verticalSliderThumbElement.style.top).toBe(`${100 - (value / max) * 100}%`);

      const { container: verticalReverseSliderContainer } = render(
        <Slider orientation="vertical-reverse" value={value} max={max} />,
      );

      const verticalReverseSliderThumbElement = getByTestId(
        verticalReverseSliderContainer,
        'sliderThumb',
      );

      expect(verticalReverseSliderThumbElement).toBeDefined();
      expect(verticalReverseSliderThumbElement.style.top).toBe(`${(value / max) * 100}%`);
    });
  });
});

describe('Slider component functionality test', () => {
  const user = userEvent.setup();

  it('When clicked, the length of the track changes to the corresponding location.', async () => {
    let testValue = 10;

    const onSliderChange = (value: number): void => {
      testValue = value;
    };

    const { container, rerender } = render(
      <Slider orientation="horizontal" value={testValue} max={max} onChange={onSliderChange} />,
    );

    const sliderElement = getByTestId(container, 'slider');
    const trackElement = getByTestId(container, 'sliderTrack');

    sliderElement.getBoundingClientRect = () => {
      return new DOMRect(0, 0, 100, 10);
    };

    await user.pointer({ keys: '[MouseLeft]', target: sliderElement, coords: { clientX: 10 } });

    expect(trackElement).toBeDefined();

    rerender(
      <Slider orientation="horizontal" value={testValue} max={max} onChange={onSliderChange} />,
    );

    expect(trackElement.style.width).toBe(`${(testValue / max) * 100}%`);
  });

  it('When clicking, the position of the thumb changes to the corresponding position.', async () => {
    let testValue = 10;

    const onSliderChange = (value: number): void => {
      testValue = value;
    };

    const { container, rerender } = render(
      <Slider orientation="horizontal" value={testValue} max={max} onChange={onSliderChange} />,
    );

    const sliderElement = getByTestId(container, 'slider');
    const thumbElement = getByTestId(container, 'sliderThumb');

    sliderElement.getBoundingClientRect = () => {
      return new DOMRect(0, 0, 100, 10);
    };

    await user.pointer({ keys: '[MouseLeft]', target: sliderElement, coords: { clientX: 10 } });

    expect(thumbElement).toBeDefined();

    rerender(
      <Slider orientation="horizontal" value={testValue} max={max} onChange={onSliderChange} />,
    );

    expect(thumbElement.style.left).toBe(`${(testValue / max) * 100}%`);
  });
});
