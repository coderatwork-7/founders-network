import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {CustomTooltip} from '.';

const meta: Meta<typeof CustomTooltip> = {
  title: 'Components/CustomTooltip',
  component: CustomTooltip,
  argTypes: {
    position: {
      options: {left: 'left', right: 'right', top: 'top', bottom: 'bottom'},
      control: {type: 'select'}
    }
  }
};

export default meta;
type Story = StoryObj<typeof CustomTooltip>;

export const Default: Story = {
  args: {
    position: 'left',
    children: <div>Put Your Content Here</div>
  }
};
