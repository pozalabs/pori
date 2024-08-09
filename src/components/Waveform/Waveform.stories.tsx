import { useEffect, useMemo, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Image, Layer, Stage } from 'react-konva';

import Waveform, { WaveformHandles } from './Waveform';
import useWaveform, { UseWaveformParams } from '../../hooks/waveform/useWaveform';
import { WAVEFORM_DEFAULT_VALUE } from '../../hooks/waveform/_constants';

const WaveformWithControlButton = (props: UseWaveformParams) => {
  const ref = useRef<WaveformHandles>(null);

  return (
    <div className="flex flex-col gap-[1rem] w-fit">
      <Waveform ref={ref} {...props} />
      <div className="flex justify-between px-[12rem]">
        <button
          className="bg-blue-50 hover:bg-blue-100 py-[0.5rem] px-[1rem] border border-blue-100 rounded-[8px] transition duration-100 ease-in-out"
          onClick={() => ref.current?.play()}
        >
          재생
        </button>
        <button
          className="bg-blue-50 hover:bg-blue-100 py-[0.5rem] px-[1rem] border border-blue-100 rounded-[8px] transition duration-100 ease-in-out"
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
    peakLength: 100,
    waveColor: '#E0E1E6',
    progressColor: '#BBF500',
    playheadBgColor: '#FF5924',
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
      currentTime,
    } = useWaveform(props);
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
      <div className="flex flex-col items-center gap-[2rem] p-[1rem] bg-[#8d8d86] rounded-lg">
        <span className="text-white self-start">audio_23ef6b7464.mp3</span>
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
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-[8px]">
            <button
              className="bg-[#E0E1E6] hover:bg-[#CDCED6] py-[0.5rem] px-[1rem] rounded-[8px] transition duration-100 ease-in-out"
              onClick={play}
            >
              재생
            </button>
            <button
              className="bg-[#E0E1E6] hover:bg-[#CDCED6] py-[0.5rem] px-[1rem] rounded-[8px] transition duration-100 ease-in-out"
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
