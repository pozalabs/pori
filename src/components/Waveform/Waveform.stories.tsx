import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Waveform, { WaveformHandles } from './Waveform';
import { UseWaveformParams } from '../../hooks/waveform/useWaveform';
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
