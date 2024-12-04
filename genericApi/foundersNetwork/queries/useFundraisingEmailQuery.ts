import {useClient} from '@/hooks/useClient';
import {useQuery} from '@tanstack/react-query';

export interface IFundraisingEmail {
  nextSend: string;
  isOptOut: boolean;
  matchedInvestorsCount: number;
  investorsViewedYou: number;
  investorMessagedYou: number;
  monthlyUpdates: string;
  revenueGrowthRate: number;
  newUserGrowthRate: number;
  currentMonthlyRevenue: string;
  lookingToRaise: number;
  currentFunding: number;
  notableInvestors: string[];
  pitchDeckImageUrl: string;
}

export const useFundraisingEmailQuery = ({userId}: {userId: string}) => {
  const client = useClient();

  const getFundraisingEmailQuery = async (): Promise<IFundraisingEmail> => {
    const res = await client.get(`/users/${userId}/fundraising-email`);

    return res.data;
  };

  return useQuery<IFundraisingEmail, Error>({
    queryKey: ['fundraisingEmail'],
    queryFn: getFundraisingEmailQuery,
    enabled: !!userId
  });
};
