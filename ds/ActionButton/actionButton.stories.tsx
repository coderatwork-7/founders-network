import type {Meta, StoryObj} from '@storybook/react';
import {ActionButton} from './actionButton';
import {faBookmark, faHeart} from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as faHeartFilled,
  faBookmark as faBookmarkFilled
} from '@fortawesome/free-solid-svg-icons';

const meta: Meta<typeof ActionButton> = {
  title: 'Components/ActionButton',
  component: ActionButton
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Like: Story = {
  args: {
    icon: faHeart,
    iconFilled: faHeartFilled,
    handleCount: true,
    count: 5
  }
};

export const Bookmark: Story = {
  args: {
    icon: faBookmark,
    iconFilled: faBookmarkFilled,
    count: 5
  }
};
