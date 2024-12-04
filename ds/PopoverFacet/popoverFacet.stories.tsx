import {StoryObj, Meta} from '@storybook/react';
import {PopoverFacet} from '.';
const meta: Meta = {
  title: 'Components/PopoverFacet',
  component: PopoverFacet
};
export default meta;
export const colorful: StoryObj = {
  args: {
    facetName: 'Filter Activity',
    facetKey: 'type',
    facetValues: [
      {
        facetValueName: 'ALL UPDATES',
        facetValueColor: 'grayDarkClass',
        facetValueKey: 'all'
      },
      {
        facetValueName: 'FORUM',
        facetValueColor: 'greenLightClass',
        facetValueKey: 'forum'
      },
      {
        facetValueName: 'FUNCTIONS',
        facetValueColor: 'regentBlueClass',
        facetValueKey: 'function'
      },
      {
        facetValueName: 'MEMBERS',
        facetValueColor: 'goldenTainoiClass',
        facetValueKey: 'member'
      },
      {
        facetValueName: 'GROUPS',
        facetValueColor: 'grayishBlueClass',
        facetValueKey: 'group'
      },
      {
        facetValueName: 'DEALS',
        facetValueColor: 'lightSalomClass',
        facetValueKey: 'deal'
      }
    ],
    isMultiselect: false,
    isSearchable: false
  }
};
export const SearchableWithCount: StoryObj = {
  args: {
    facetName: 'State',
    facetKey: 'state',
    facetValues: [
      {
        facetValueName: 'Rajasthan',
        facetValueCount: '2',
        facetValueKey: 'raj'
      },
      {
        facetValueName: 'MP',
        facetValueCount: '3',
        facetValueKey: 'mp'
      },
      {
        facetValueName: 'Maharashtra',
        facetValueCount: '5',
        facetValueKey: 'mah'
      },
      {
        facetValueName: 'Uttar Pradesh',
        facetValueCount: '5',
        facetValueKey: 'up'
      },
      {
        facetValueName: 'Haryana',
        facetValueCount: '2',
        facetValueKey: 'har'
      },
      {
        facetValueName: 'Arunachal Pradesh',
        facetValueCount: '1',
        facetValueKey: 'ap'
      },
      {
        facetValueName: 'Sikkim',
        facetValueCount: '1',
        facetValueKey: 'sik'
      },
      {
        facetValueName: 'Tamil Nadu',
        facetValueCount: '2',
        facetValueKey: 'tm'
      },
      {
        facetValueName: 'West Bengal',
        facetValueCount: '2',
        facetValueKey: 'wb'
      },
      {
        facetValueName: 'Uttarakhand',
        facetValueCount: '3',
        facetValueKey: 'ut'
      }
    ],
    isMultiselect: false,
    isSearchable: true
  }
};
