/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Image, Layer, Stage } from 'react-konva';

import type { WaveformHandles } from './Waveform';
import Waveform from './Waveform';
import { WAVEFORM_DEFAULT_VALUE } from '../../hooks/waveform/_constants';
import type { UseWaveformParams } from '../../hooks/waveform/useWaveform';
import useWaveform from '../../hooks/waveform/useWaveform';

const WaveformWithControlButton = (props: UseWaveformParams) => {
  const ref = useRef<WaveformHandles>(null);

  return (
    <div className="flex w-fit flex-col gap-4">
      <Waveform ref={ref} {...props} />
      <div className="flex justify-between px-48">
        <button
          className="rounded-[8px] border border-blue-100 bg-blue-50 px-4 py-2 transition duration-100 ease-in-out hover:bg-blue-100"
          onClick={() => ref.current?.play()}
        >
          재생
        </button>
        <button
          className="rounded-[8px] border border-blue-100 bg-blue-50 px-4 py-2 transition duration-100 ease-in-out hover:bg-blue-100"
          onClick={() => ref.current?.pause()}
        >
          일시정지
        </button>
      </div>
    </div>
  );
};

const meta = {
  title: 'Waveform',
  component: WaveformWithControlButton,
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

const src = 'https://cdn.pixabay.com/audio/2023/06/12/audio_23ef6b7464.mp3';

export const Canvas: Story = {
  args: { ...WAVEFORM_DEFAULT_VALUE, type: 'canvas', src },
};
export const Svg: Story = {
  args: { ...WAVEFORM_DEFAULT_VALUE, type: 'svg', src },
};
export const Konva: Story = {
  args: {
    ...WAVEFORM_DEFAULT_VALUE,
    type: 'canvas',
    variant: 'bar',
    width: 400,
    height: 50,
    gap: 2,
    waveColor: '#E0E1E6',
    progressColor: '#BBF500',
    bgColor: '#8D8D86',
    src,
  },
  render: (props: UseWaveformParams) => {
    const {
      waveform,
      play,
      pause,
      changeCurrentTime,
      showHoveredWaveform,
      hideHoveredWaveform,
      duration,
    } = useWaveform(props);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useRef<any>();
    const dpr = useMemo(() => window.devicePixelRatio || 1, []);

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
      showHoveredWaveform(e.evt);
    };

    const updateCurrentTime = (e: KonvaEventObject<MouseEvent>): void => {
      const rect = e.target.getClientRect();
      const clickPosition = e.target.getRelativePointerPosition();

      if (!clickPosition) return;

      const targetWidth = rect.width;
      const clickX = clickPosition.x / dpr;
      const percent = (clickX / targetWidth) * 100;
      const newCurrentTime = (percent * duration) / 100;

      changeCurrentTime(newCurrentTime);
    };

    useEffect(() => {
      let frameId = 0;

      const drawLayer = (): void => {
        ref.current.batchDraw();
        frameId = requestAnimationFrame(drawLayer);
      };
      frameId = requestAnimationFrame(drawLayer);

      return () => cancelAnimationFrame(frameId);
    }, []);

    return (
      <div className="flex flex-col items-center gap-8 rounded-lg bg-[#8d8d86] p-4">
        <span className="self-start text-white">audio_23ef6b7464.mp3</span>
        <Stage width={props.width} height={props.height}>
          <Layer ref={ref}>
            <Image
              image={waveform}
              alt="waveform"
              onClick={updateCurrentTime}
              onMouseMove={handleMouseMove}
              onMouseOut={hideHoveredWaveform}
              scale={{ x: 1 / dpr, y: 1 / dpr }}
            />
          </Layer>
        </Stage>
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-[8px]">
            <button
              className="rounded-[8px] bg-[#E0E1E6] px-4 py-2 transition duration-100 ease-in-out hover:bg-[#CDCED6]"
              onClick={play}
            >
              재생
            </button>
            <button
              className="rounded-[8px] bg-[#E0E1E6] px-4 py-2 transition duration-100 ease-in-out hover:bg-[#CDCED6]"
              onClick={pause}
            >
              일시정지
            </button>
          </div>
        </div>
      </div>
    );
  },
};
