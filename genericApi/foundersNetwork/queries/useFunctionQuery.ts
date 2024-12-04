import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useFunctionQuery = (id: string) => {
  const {data: session} = useSession();

  const getFunction = async (id: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/function/${id}`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );

    return res.data;
  };

  const {data, isLoading, isError} = useQuery({
    queryKey: ['function', id],
    queryFn: () => getFunction(id),
    enabled: !!session?.user?.profileId
  });

  return {
    data,
    isLoading,
    isError
  };
};
