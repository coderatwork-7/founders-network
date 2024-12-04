import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import {useCallback} from 'react';

export const useGeneralQuery = () => {
  const {data: session} = useSession();

  const getGeneral = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user?.profileId}/general`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );

    return await res.json();
  }, [session]);

  const {data, isLoading, isError} = useQuery({
    queryKey: ['general'],
    queryFn: getGeneral,
    enabled: !!session?.user?.id
  });

  return {
    data,
    isLoading,
    isError
  };
};
