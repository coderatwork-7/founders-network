import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {CommentBox, CommentData} from './commentsBox';

const meta: Meta<typeof CommentBox> = {
  title: 'Components/CommentBox',
  component: CommentBox
};

export default meta;
type Story = StoryObj<typeof CommentBox>;

const data: CommentData[] = [
  {
    id: 53280,
    content:
      'Check out Jumpcrew.&nbsp; I can make an introduction if you like.',
    author: {
      profileId: 6103,
      name: 'Prateek Mathur',
      badge: 'Angel',
      avatarUrl:
        'https://res.cloudinary.com/foundersnetwork/image/upload/c_limit,f_jpg,h_400,r_4,w_400/g_south_east,l_fn_22_mw4cdy,r_0:0:4:0/v1/production/userprofile/9acb03ed001b850f95b881ade1031f0b.jpg',
      companyName: 'Activated Scale'
    },
    datetime: {
      creationDate: '2023-05-04T15:27:46.819506Z',
      startTimePT: '08:27:46 PDT',
      startTimeET: '11:27:46 EDT'
    },
    like: {
      count: 1,
      liked: true,
      profile: [
        {
          id: 5631,
          name: 'Dusan Zamahajev'
        }
      ]
    },
    attachment: []
  },
  {
    id: 53281,
    content:
      "My potentially unhelpful advice is, don't encourage them. Most of them are hawking crappy lists of irrelevant (to you) companies that will never, under any circumstances, engage with you.How do I know? Because my company is on dozens of those crappy lists, and most of them have zero relevance to us.&#160;Don't encourage them.&#160;",
    author: {
      profileId: 2059,
      name: 'Tim Sylvester',
      badge: 'Angel',
      avatarUrl:
        'https://res.cloudinary.com/foundersnetwork/image/upload/c_limit,f_jpg,h_400,r_4,w_400/g_south_east,l_fn_22_mw4cdy,r_0:0:4:0/v1/production/userprofile/e30a6936bde9cf6dd7353d0d2c14bfed.jpg',
      companyName: 'Integrated Roadways'
    },
    datetime: {
      creationDate: '2023-05-04T15:30:21.433468Z',
      startTimePT: '08:30:21 PDT',
      startTimeET: '11:30:21 EDT'
    },
    like: {
      count: 0,
      liked: false,
      profile: []
    },
    attachment: [
      {
        filename: 'sample1.jpg',
        url: 'https://fnprofileimages3.s3.amazonaws.com/dev/files/hiij0u8/sample1.jpg'
      },
      {
        filename: 'sample1.jpg',
        url: 'https://fnprofileimages3.s3.amazonaws.com/dev/files/hiij0u8/sample1.jpg'
      }
    ]
  }
];

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const WithComments: Story = {
  args: {
    data: data
  }
};

export const WithoutComments: Story = {
  args: {
    data: []
  }
};
