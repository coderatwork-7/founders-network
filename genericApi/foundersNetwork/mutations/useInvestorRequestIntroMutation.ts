import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

interface IProps {
  memberId?: string | number;
  memberName: string;
  investorName: string;
  investorId: string;
}

export const useInvestorRequestIntroMutation = () => {
  const postRequestIntro = async ({
    memberName,
    memberId,
    investorName,
    investorId
  }: IProps) => {
    try {
      return await axios.post('/api/investor-intro-request', {
        memberName,
        memberId,
        investorName,
        investorId
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
