import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Checkbox, CheckboxProps, CheckboxSize} from './checkbox';

const meta: Meta<CheckboxProps> = {
  title: 'Components/Input/Checkbox',
  component: Checkbox
};

export default meta;
type CheckboxStory = StoryObj<CheckboxProps>;

export const Small: CheckboxStory = {
  args: {
    id: 'checkbox',
    checked: true,
    size: CheckboxSize.Small,
    children: <span>'Hello'</span>
  }
};

export const Default: CheckboxStory = {
  args: {
    id: 'checkbox',
    checked: true,
    size: CheckboxSize.Medium
  }
};

export const Large: CheckboxStory = {
  args: {
    id: 'checkbox',
    checked: true,
    size: CheckboxSize.Large
  }
};

export const Unchecked: CheckboxStory = {
  args: {
    id: 'checkbox',
    checked: false,
    size: CheckboxSize.Medium
  }
};

export const Disabled: CheckboxStory = {
  args: {
    id: 'checkbox',
    checked: true,
    size: CheckboxSize.Medium,
    disabled: true
  }
};
