import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Button, ButtonVariants} from './button';
import {Spinner} from 'react-bootstrap';
import {faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      options: ButtonVariants,
      control: {type: 'select'}
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: {type: 'select'}
    },
    disabled: {type: 'boolean'},
    textUppercase: {type: 'boolean'}
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    children: 'Button',
    variant: ButtonVariants.Primary
  }
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    variant: ButtonVariants.Primary,
    disabled: true
  }
};

export const Loading: Story = {
  args: {
    children: (
      <>
        <Spinner animation={'border'} size="sm" className="me-1" />
        Loading
      </>
    ),
    variant: ButtonVariants.Primary,
    disabled: false
  }
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span className="me-2">Button with Icon</span>
        <FontAwesomeIcon icon={faAngleRight} className="fa-1x" />
      </>
    ),
    variant: ButtonVariants.Primary
  }
};
