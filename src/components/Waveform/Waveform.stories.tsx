import type { Meta, StoryObj } from '@storybook/react';
import Waveform from './Waveform';

const meta = {
  title: 'Waveform',
  component: Waveform,
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: 'bg-black text-white',
  },
};
