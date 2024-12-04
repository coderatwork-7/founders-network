import type {Meta, StoryObj} from '@storybook/react';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {DropdownItem} from '@/types/dropdown';
import {KeywordInputFacet} from '.';

const meta: Meta<typeof KeywordInputFacet> = {
  title: 'Components/KeywordInput',
  component: KeywordInputFacet
};

export default meta;
type Story = StoryObj<typeof KeywordInputFacet>;

const dropdownItems: Record<string, DropdownItem> = {
  594: {
    name: '3D Printing',
    id: '594',
    feedsCount: 14
  },
  680: {
    name: '2-Sided Marketing',
    id: '680',
    feedsCount: 9
  }
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    labelText: 'Add up to 3 tags:',
    icon: faSearch,
    dropdownItems: dropdownItems
  }
};
