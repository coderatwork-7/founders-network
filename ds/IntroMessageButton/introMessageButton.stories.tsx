import type {Meta, StoryObj} from '@storybook/react';
import {IntroMessageButton} from './introMessageButton';

const meta: Meta<typeof IntroMessageButton> = {
  title: 'Components/IntroMessageButton',
  component: IntroMessageButton
};

export default meta;
type Story = StoryObj<typeof IntroMessageButton>;

export const Default: Story = {
  args: {}
};
