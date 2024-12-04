import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

interface IProps {
  memberId?: string | number;
  memberName?: string;
}

export const useUpgradeMembershipMutation = () => {
  const postRequestIntro = async ({memberName, memberId}: IProps) => {
    try {
      return await axios.post('/api/upgrade-membership', {
        memberName,
        memberId
      });
    } catch (error) {
      console.error('Error sending message to Slack:', error);
      return false;
    }
  };

  return useMutation({
    mutationFn: postRequestIntro
  });
};
