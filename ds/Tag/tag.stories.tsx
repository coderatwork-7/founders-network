import type {Meta, StoryObj} from '@storybook/react';
import {Tag} from './tag';

const meta: Meta = {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    defaultSelected: {type: 'boolean'},
    selectable: {type: 'boolean'}
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    children: 'Hello',
    selectable: true,
    defaultSelected: true
  }
};
