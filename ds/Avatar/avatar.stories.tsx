import {StoryObj, Meta} from '@storybook/react';

import Avatar from './avatar';
import {LAUNCH, LEAD, LIFETIME, SCALE} from '@/utils/common/constants';
const meta: Meta = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      options: ['md', 'sm', 'lg'],
      control: {type: 'select'}
    },
    badge: {
      options: [LAUNCH, SCALE, LEAD, LIFETIME],
      control: {type: 'select'}
    }
  }
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const avatar: Story = {
  args: {
    size: 'md',
    badge: LIFETIME,
    avatarUrl:
      'https://res.cloudinary.com/foundersnetwork/image/upload/c_scale,h_58,r_4,w_58/g_south_east,h_11,l_fn_22_mw4cdy,r_0:0:4:0,w_11/v1/production/userprofile/da59df85100fe97b7a622c76ab291de4.jpg'
  }
};
export const NewAvatar: Story = {
  args: {
    newDesign: true,
    imageHeight: 72,
    imageWidth: 72,
    altText: 'profile',
    badge: LIFETIME,
    avatarUrl:
      'https://res.cloudinary.com/foundersnetwork/image/upload/c_scale,h_58,r_4,w_58/g_south_east,h_11,l_fn_22_mw4cdy,r_0:0:4:0,w_11/v1/production/userprofile/da59df85100fe97b7a622c76ab291de4.jpg'
  }
};
