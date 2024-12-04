import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Modal} from './modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal
};

export default meta;
type Story = StoryObj<typeof Modal>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    children: 'Hi',
    show: true
  }
};
