import {Meta, StoryObj} from '@storybook/react';
import {ScrollButton} from './scrollButton';

const meta: Meta = {
  title: 'Components/ScrollButton',
  component: ScrollButton,
  argTypes: {
    alwaysVisible: {
      options: [true, false],
      control: {type: 'select'}
    }
  }
};
export default meta;
type Story = StoryObj<typeof ScrollButton>;
export const scrollbutton: Story = {
  args: {
    alwaysVisible: false,
    scrollVisibleHeight: 13
  }
};
