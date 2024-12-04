import type {Meta, StoryObj} from '@storybook/react';
import {MembersCard} from './membersCard';

const meta: Meta<typeof MembersCard> = {
  title: 'Components/MembersCard',
  component: MembersCard
};

export default meta;
type Story = StoryObj<typeof MembersCard>;

const data = {
  id: '4991',
  firstName: 'Kevin',
  lastName: 'Holmes',
  badge: 'Lifetime',
  avatarUrl:
    'https://res.cloudinary.com/foundersnetwork/image/upload/c_limit,f_jpg,h_110,r_4,w_110/g_south_east,l_fn_22_mw4cdy,r_0:0:4:0/v1/production/userprofile/7b00190a7c5165946c391a25014045f0.jpg',
  dateTime: {
    creationDate: '2023-06-20'
  },
  designation: 'Founder & CEO',
  companyName: 'Founders Network',
  expertise: [
    {
      name: 'Proptech',
      id: '97'
    },
    {
      name: 'Software',
      id: '755'
    },
    {
      name: 'Strategy',
      id: '723'
    },
    {
      name: 'Marketing & Sales',
      id: '234'
    },
    {
      name: 'Leadership',
      id: '678'
    },
    {
      name: 'Fintech',
      id: '945'
    }
  ],
  objectives: {
    first:
      'Recruiting new chapter leaders in Austin, Boston, Denver, LA, SF, Paris, Dubai, Hong Kong, Sao Paolo, Tel Aviv, Toronto, Miami',
    second:
      'Connect with founders in the food and beverage industry to share experiences, learnings, and connections.',
    third:
      'We are looking to add to our Business Development, Sales, and Partnership team.'
  },
  priorities: 'Founders Helping Founders since 2011',
  city: {
    name: 'San Francisco',
    id: 'SF'
  },
  stage: {
    name: 'Series-A+',
    id: 'seriesa+'
  },
  sector: [
    {
      name: 'Technology',
      id: '1'
    },
    {
      name: 'iOS',
      id: '2'
    },
    {
      name: 'Technology',
      id: '3'
    },
    {
      name: 'iOS',
      id: '4'
    },
    {
      name: 'Technology',
      id: '5'
    },
    {
      name: 'iOS',
      id: '6'
    }
  ]
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ListCard: Story = {
  args: {data}
};

export const GridCard: Story = {
  args: {data, grid: true}
};
