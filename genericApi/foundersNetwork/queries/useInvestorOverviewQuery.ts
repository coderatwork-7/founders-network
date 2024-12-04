import {isError, useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import {useCallback} from 'react';

export const useInvestorOverviewQuery = (id?: string | number | null) => {
  const {data: session} = useSession();

  const accessToken = session?.user.tokens.access;

  const getInvestorOverview = useCallback(
    async (id?: string | number | null) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${id}/overview`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      );

      return await res.json();
    },
    [session]
  );

  const {data, isLoading} = useQuery({
    queryKey: ['investorOverview'],
    queryFn: () => getInvestorOverview(id),
    enabled: !!id && !!accessToken
  });

  return {
    data,
    isLoading,
    isError
  };
};
