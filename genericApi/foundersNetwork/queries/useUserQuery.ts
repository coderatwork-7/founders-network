import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useUserQuery = (profileId?: string | number | null) => {
  const {data: session} = useSession();

  const accessToken = session?.user.tokens.access;

  const getUser = async (profileId?: string | number | null) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${profileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return res.data;
  };

  const {data, isLoading, isError} = useQuery({
    queryKey: ['user', profileId],
    queryFn: () => getUser(profileId),
    enabled: !!profileId && !!accessToken
  });

  return {data, isLoading, isError};
};
