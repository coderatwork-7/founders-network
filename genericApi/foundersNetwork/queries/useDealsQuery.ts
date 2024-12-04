import {IDeal} from '@/utils/interfaces/deal';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export interface IDeals {
  scale: IDeal[];
  launch: IDeal[];
  lifetime: IDeal[];
  lead: IDeal[];
  info: string;
}

export const useDealsQuery = (): {
  data?: IDeals;
  isLoading: boolean;
  isError: boolean;
} => {
  const {data: session} = useSession();

  const getDeals = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user?.id}/deals`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );

    return {
      launch: res.data.bootstrap as IDeal[],
      scale: res.data.angel as IDeal[],
      lead: res.data['seriesA+'] as IDeal[],
      lifetime: res.data.lifetime as IDeal[],
      info: res.data.info as string
    };
  };

  const {data, isLoading, isError} = useQuery({
    queryKey: ['deals'],
    queryFn: getDeals,
    enabled: !!session?.user?.id
  });

  return {
    data,
    isLoading,
    isError
  };
};
