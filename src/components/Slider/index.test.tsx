import { getByTestId, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Slider from '.';

const value = 10;
const max = 55;

describe('Slider 컴포넌트 렌더링 테스트', () => {
  describe('수평 슬라이더일 때', () => {
    it('track의 길이는 value / max를 퍼센트 단위로 환산한 값이다.', () => {
      const { container } = render(<Slider orientation="horizontal" value={value} max={max} />);

      const trackElement = getByTestId(container, 'sliderTrack');

      expect(trackElement).toBeDefined();
      expect(trackElement.style.width).toBe(`${(value / max) * 100}%`);
    });

    it('thumb는 track의 수평 끝에 위치해 있다.', () => {
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

  describe('수직 슬라이더일 때', () => {
    it('track의 높이는 value / max를 퍼센트 단위로 환산한 값이다.', () => {
      const { container } = render(<Slider orientation="vertical" value={value} max={max} />);

      const trackElement = getByTestId(container, 'sliderTrack');

      expect(trackElement).toBeDefined();
      expect(trackElement.style.height).toBe(`${(value / max) * 100}%`);
    });

    it('thumb는 track의 수직 끝에 위치해 있다.', () => {
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

describe('Slider 컴포넌트 동작 테스트', () => {
  const user = userEvent.setup();

  it('클릭 시 해당 위치로 track의 길이가 변경된다.', async () => {
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

  it('클릭 시 해당 위치로 thumb의 위치가 변경된다.', async () => {
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
