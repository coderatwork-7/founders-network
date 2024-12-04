import type {Meta, StoryObj} from '@storybook/react';
import {Rating, RatingTextPos} from './rating';

const meta: Meta = {
  title: 'Components/Rating',
  component: Rating,
  argTypes: {
    rating: {type: 'number'},
    ratingTextPosition: {
      options: RatingTextPos,
      control: {type: 'select'}
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {}
};
