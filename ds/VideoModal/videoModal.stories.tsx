import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {VideoModal} from './videoModal';

const meta: Meta<typeof VideoModal> = {
  title: 'Components/VideoModal',
  component: VideoModal
};

export default meta;
type Story = StoryObj<typeof VideoModal>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    showModal: true,
    videoLink:
      '<iframe src="//player.vimeo.com/video/70446472?title=0&amp;byline=0&amp;portrait=0&amp;color=336699" width="100%" height="100%" frameborder="0" allowfullscreen="allowfullscreen"></iframe>'
  }
};
