import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { SLIDER_DEFAULT_VALUE } from './_constants';
import Slider from './Slider';

const DemoComponent = (params: Parameters<typeof Slider>[0]) => {
  const [value, setValue] = useState(0);

  const onValueChange = (value: number): void => {
    setValue(value);
  };

  return (
    <div>
      <Slider value={value} onValueChange={onValueChange} onDrag={onValueChange} {...params} />
      <span>{value}</span>
    </div>
  );
};

const meta = {
  title: 'Slider',
  component: DemoComponent,
} satisfies Meta<typeof DemoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...SLIDER_DEFAULT_VALUE,
    className: 'w-[400px] h-[20px] rounded-full',
    step: 5,
  },
};
