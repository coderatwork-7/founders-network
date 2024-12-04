import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Popover} from './popover';

const meta: Meta = {
  title: 'Components/Popover',
  component: Popover,
  argTypes: {
    placement: {
      options: [
        'auto-start',
        'auto',
        'auto-end',
        'top-start',
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-end',
        'bottom',
        'bottom-start',
        'left-end',
        'left',
        'left-start'
      ],
      control: {type: 'select'}
    },
    mode: {
      options: ['hover', 'click'],
      control: {type: 'select'}
    },
    hideArrow: {type: 'boolean'},
    hideOnBlur: {type: 'boolean'},
    showDropdown: {type: 'boolean'},
    children: {
      disable: true,
      table: {
        disable: true
      }
    },
    popover: {
      disable: true,
      table: {
        disable: true
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Bottom: Story = {
  args: {
    placement: 'bottom',
    mode: 'hover',
    children: <button>Hover to Open Popover</button>,
    popover: <div>Popover content</div>,
    showDropdown: true
  }
};

export const RightStart: Story = {
  args: {
    placement: 'right-start',
    mode: 'click',
    children: <button>Click to Open Popover</button>,
    popover: (
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero placeat
        quaerat tempora velit pariatur temporibus quos, eum fugiat ipsam a!
      </div>
    ),
    hideOnBlur: true,
    hideArrow: true
  }
};
