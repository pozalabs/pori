/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import type { Group as TGroup } from 'konva/lib/Group';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Transformer as TTransformer } from 'konva/lib/shapes/Transformer';
import { Group, Image, Layer, Rect, Stage, Text, Transformer } from 'react-konva';

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
    height: 60,
    gap: 2,
    waveColor: '#8d8d8d',
    progressColor: '#F24905',
    hoveredColor: '#F98868',
    bgColor: '#E1DCCF',
    src,
  },
  render: (props: UseWaveformParams) => {
    const [audioItem, setAudioItem] = useState({
      x: 100,
      y: 100,
      width: 440,
      height: 148,
      rotation: 0,
    });
    const AUDIO_PADDING_X = 12;
    const AUDIO_PADDING_Y = 20;
    const [waveformProps, setWaveformProps] = useState(props);

    const {
      waveform,
      play,
      pause,
      changeCurrentTime,
      showHoveredWaveform,
      hideHoveredWaveform,
      duration,
    } = useWaveform(waveformProps);

    const SCALE = audioItem.height / 148;
    const MAX_WIDTH = audioItem.width - AUDIO_PADDING_X * 2 * SCALE;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useRef<any>();
    const trRef = useRef<TTransformer>(null);
    const shapeRef = useRef<TGroup>(null);
    const dpr = useMemo(() => Math.max(window.devicePixelRatio, 1), []);
    const [selected, setSelected] = useState(false);

    const onDragEnd = (): void => {
      if (!shapeRef.current) return;
      const node = shapeRef.current;
      setAudioItem({ ...audioItem, x: node.x(), y: node.y() });
    };

    const handleTransformEnd = (): void => {
      if (!shapeRef.current) return;
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      const width = node.width() * scaleX;
      const height = node.height() * scaleY;

      setAudioItem({ x: node.x(), y: node.y(), rotation: node.rotation(), width, height });

      setWaveformProps({
        ...waveformProps,
        height: 60 * (height / 148),
        width: width - AUDIO_PADDING_X * 2 * scaleX,
      });
    };

    const onSelectNode = (e: KonvaEventObject<MouseEvent>) => {
      if (e.target.name() === 'waveform') return;
      setSelected(true);
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
      const pointerPositionX = e.target.getRelativePointerPosition()?.x;
      const playheadPosition = pointerPositionX ? pointerPositionX / dpr : undefined;
      showHoveredWaveform(e.evt, playheadPosition);
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

    useEffect(() => {
      if (!shapeRef.current) return;
      if (selected) {
        // we need to attach transformer manually
        trRef.current?.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }, [selected, waveform]);

    return (
      <div className="flex flex-col items-center gap-8 rounded-lg bg-[#f0f0f3] p-4">
        <Stage width={window.innerWidth} height={300}>
          <Layer ref={ref}>
            <Group
              x={audioItem.x}
              y={audioItem.y}
              width={audioItem.width}
              height={audioItem.height}
              rotation={audioItem.rotation}
              draggable
              ref={shapeRef}
              onClick={onSelectNode}
              onDragEnd={onDragEnd}
              onTransformEnd={handleTransformEnd}
            >
              <Rect
                fill="#E1DCCF"
                width={audioItem.width}
                height={audioItem.height}
                x={0}
                y={0}
                cornerRadius={6}
              />
              <Text
                x={AUDIO_PADDING_X * SCALE}
                y={AUDIO_PADDING_Y * SCALE}
                text="audio_23ef6b7464.mp3"
                fontSize={12 * SCALE}
                lineHeight={1.33}
                width={MAX_WIDTH}
                fill="#344217"
                fontFamily="Inter"
                wrap="none"
                ellipsis={true}
              />
              <Image
                name="waveform"
                image={waveform}
                alt="waveform"
                onClick={updateCurrentTime}
                x={AUDIO_PADDING_X * SCALE}
                y={36 * SCALE}
                onMouseMove={handleMouseMove}
                onMouseOut={hideHoveredWaveform}
                scale={{ x: 1 / dpr, y: 1 / dpr }}
              />
            </Group>
            {selected && (
              <Transformer
                ref={trRef}
                flipEnabled={false}
                borderStrokeWidth={1.5}
                borderStroke="#5F7F00"
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                anchorStroke="#5F7F00"
                anchorStrokeWidth={1}
                rotateAnchorOffset={30}
              />
            )}
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
