import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {TinyMCEEditor} from './tinyMCEEditor';

const meta: Meta<typeof TinyMCEEditor> = {
  title: 'Components/TinyMCEEditor',
  component: TinyMCEEditor
};

export default meta;
type Story = StoryObj<typeof TinyMCEEditor>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    tinymceScriptSrc: 'http://localhost:6006/tinymce/tinymce.min.js'
  }
};
