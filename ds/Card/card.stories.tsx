import {StoryObj, Meta} from '@storybook/react';
import Card from './card';
import {
  CONST_DEAL,
  CONST_FUNCTION,
  CONST_GROUP,
  CONST_FORUM,
  CONST_MEMBER
} from '@/utils/common/constants';
const meta: Meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    feedsType: {
      options: [
        CONST_DEAL,
        CONST_FUNCTION,
        CONST_GROUP,
        CONST_FORUM,
        CONST_MEMBER
      ],
      control: {type: 'select'}
    }
  }
};
export default meta;
export const card: StoryObj = {
  args: {
    feedsType: CONST_FUNCTION
  }
};
