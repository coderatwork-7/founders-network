import type {Meta, StoryObj} from '@storybook/react';
import {Tooltip} from './tooltip';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {}
};

export default meta;
type Story = StoryObj;

export const TooltipBasic: Story = {
  args: {
    popover: 'Dummy Text to Show inside Tooltip. JSX can also be passed here.'
  }
};
