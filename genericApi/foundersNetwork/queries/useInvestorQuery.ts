import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useInvestorQuery = (investorId?: string | number) => {
  const {data: session} = useSession();

  const accessToken = session?.user.tokens.access;
  const getInvestor = async (investorId?: number | string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user?.id}/investors/${investorId}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    );
    return res.data;
  };

  const {data, isLoading, isError} = useQuery({
    queryKey: ['investor', investorId],
    queryFn: () => getInvestor(investorId),
    enabled: !!session?.user?.profileId && !!investorId && !!accessToken
  });

  return {
    data,
    isLoading,
    isError
  };
};
