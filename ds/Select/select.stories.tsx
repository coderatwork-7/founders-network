import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Select} from './select';

const meta: Meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {}
};

export default meta;
type Story = StoryObj;

export const SelectBasic: Story = {
  args: {
    items: [10, 20, 30]
  }
};

export const SelectJSX: Story = {
  args: {
    items: [
      <span className="text-danger" key="1" select-key="1">
        Hello
      </span>,
      <span className="text-success" key="2" select-key="2">
        World
      </span>
    ]
  }
};
