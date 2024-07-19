import type { Meta, StoryObj } from '@storybook/react';
import Waveform from './Waveform';

const meta = {
  title: 'Waveform',
  component: Waveform,
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

const src =
  'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/FJ0jWTSfcbi51kNU7wxl6fJNMyjFEpRse1IkpBXx.mp3';

export const Canvas: Story = {
  args: {
    src,
    type: 'canvas',
  },
};
export const Svg: Story = {
  args: {
    src,
    type: 'svg',
  },
};
