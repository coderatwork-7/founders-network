import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useUserDetailQuery = (userId?: number) => {
  const {data: session} = useSession();

  const getUserDetail = async (userId?: number) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/detail`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );
    return res.data;
  };

  const {data, isLoading, isError} = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDetail(userId),
    enabled: !!userId
  });

  return {data, isLoading, isError};
};
