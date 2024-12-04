import React from 'react';
import {Meta, StoryObj} from '@storybook/react';
import {FormControl} from './formControl';

const meta: Meta<typeof FormControl> = {
  title: 'Components/FormControl',
  component: FormControl,
  argTypes: {
    size: {
      options: ['lg', 'md', 'sm'],
      control: {type: 'select'}
    },
    as: {
      options: ['input', 'textarea'],
      control: {type: 'select'}
    },
    disabled: {type: 'boolean'},
    required: {type: 'boolean'},
    isInvalid: {type: 'boolean'},
    floatingLabel: {type: 'boolean'},
    message: {type: 'string'}
  },
  args: {
    placeholder: 'Form Label'
  }
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const NotFloatingLabel: Story = {
  args: {
    floatingLabel: false
  }
};

export const Default: Story = {
  args: {
    required: false
  }
};

export const DefaultRequired: Story = {
  args: {
    required: false
  }
};

export const Valid: Story = {
  args: {
    isValid: true
  }
};

export const Invalid: Story = {
  args: {
    isInvalid: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const WithMessage: Story = {
  args: {
    message: 'Field required'
  }
};

export const FileInput: Story = {
  args: {
    type: 'file'
  }
};

export const Password: Story = {
  args: {
    required: true,
    type: 'password',
    showLabel: 'Show',
    hideLabel: 'Hide'
  }
};
