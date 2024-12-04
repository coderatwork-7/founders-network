import type {Meta, StoryObj} from '@storybook/react';
import {DatePickerFacet} from './datePickerFacet';

const meta: Meta<typeof DatePickerFacet> = {
  title: 'Components/DatePicker',
  component: DatePickerFacet,
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof DatePickerFacet>;

export const Default: Story = {
  args: {
    events: [new Date('2023-06-12').toISOString(), new Date().toISOString()],
    selectedDate: new Date('2023-06-13'),
    onDateClick(date) {
      this.selectedDate = date;
    }
  }
};
