import type {Meta, StoryObj} from '@storybook/react';
import {Badge} from './badge';
import {AlertIcon} from '../Icons';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    count: 23,
    icon: <AlertIcon />
  }
};
