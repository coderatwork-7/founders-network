import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';
import {useCallback} from 'react';

export const useAcceleratorQuery = () => {
  const {data: session} = useSession();

  const getAccelerator = useCallback(async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user?.profileId}/accelerator`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );

    return res.data;
  }, [session]);

  const {data, isLoading, isError} = useQuery({
    queryKey: ['accelerator'],
    queryFn: getAccelerator,
    enabled: !!session?.user?.profileId
  });

  return {
    data,
    isLoading,
    isError
  };
};
