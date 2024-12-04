import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useInvestorOverviewMutation = (investorId?: string | number) => {
  const queryClient = useQueryClient();

  const {data: session} = useSession();
  const accessToken = session?.user.tokens.access;

  const id = session?.user.id;

  const putInvestorOverview = async (investor: any) => {
    return await axios.put(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${id}/overview`,
      investor,
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    );
  };

  return useMutation({
    mutationFn: putInvestorOverview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['investorOverview']);
    }
  });
};
