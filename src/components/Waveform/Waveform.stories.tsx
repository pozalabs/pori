import { useEffect, useMemo, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Image, Layer, Stage } from 'react-konva';

import Waveform, { WaveformHandles } from './Waveform';
import useWaveform, {
  UseWaveformParams,
} from '../../hooks/waveform/useWaveform';
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

const src =
  'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/FJ0jWTSfcbi51kNU7wxl6fJNMyjFEpRse1IkpBXx.mp3';

export const Canvas: Story = {
  args: { ...WAVEFORM_DEFAULT_VALUE, type: 'canvas', src },
};
export const Svg: Story = {
  args: { ...WAVEFORM_DEFAULT_VALUE, type: 'svg', src },
};
export const Konva: Story = {
  args: { ...WAVEFORM_DEFAULT_VALUE, type: 'canvas', src },
  render: (props: UseWaveformParams) => {
    const { waveform, play, pause, changeCurrentTime, duration } =
      useWaveform(props);
    const isDraggingRef = useRef(false);
    const ref = useRef<any>();
    const dpr = useMemo(() => window.devicePixelRatio ?? 1, []);

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

    const onElementMouseDown = (): void => {
      isDraggingRef.current = true;
    };
    const onElementMouseUp = (): void => {
      isDraggingRef.current = false;
    };
    const onElementMouseMove = (e: KonvaEventObject<MouseEvent>): void => {
      if (!isDraggingRef.current) return;

      updateCurrentTime(e);
    };

    return (
      <div className="flex flex-col gap-[1rem] w-fit">
        <Stage width={props.width} height={props.height! * 2}>
          <Layer ref={ref}>
            <Image
              image={waveform}
              alt="waveform"
              onClick={updateCurrentTime}
              onMouseDown={onElementMouseDown}
              onMouseUp={onElementMouseUp}
              onMouseLeave={onElementMouseUp}
              onMouseMove={onElementMouseMove}
              scale={{ x: 1 / dpr, y: 1 / dpr }}
            />
          </Layer>
        </Stage>
        <div className="flex justify-between px-[12rem]">
          <button
            className="bg-blue-50 hover:bg-blue-100 py-[0.5rem] px-[1rem] border border-blue-100 rounded-[8px] transition duration-100 ease-in-out"
            onClick={play}
          >
            재생
          </button>
          <button
            className="bg-blue-50 hover:bg-blue-100 py-[0.5rem] px-[1rem] border border-blue-100 rounded-[8px] transition duration-100 ease-in-out"
            onClick={pause}
          >
            일시정지
          </button>
        </div>
      </div>
    );
  },
};
