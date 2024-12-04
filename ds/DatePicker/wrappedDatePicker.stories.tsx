import type {Meta, StoryObj} from '@storybook/react';
import {StorybookWrapper} from './storybookWrapper';
import {DatePickerFacet} from './datePickerFacet';

const meta: Meta<typeof StorybookWrapper> = {
  title: 'Components/DatePicker',
  component: StorybookWrapper,
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof DatePickerFacet>;

export const Functional: Story = {
  args: {
    events: [
      new Date('2023-06-12').toISOString(),
      new Date().toISOString(),
      new Date('2023-07-12').toISOString()
    ]
  }
};
