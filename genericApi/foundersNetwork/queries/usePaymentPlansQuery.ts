import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const usePaymentPlansQuery = () => {
  const {data: session} = useSession();

  const getPaymentPlans = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/stage-payment-plan`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );
    return res.data;
  };

  const {data, isLoading, isError} = useQuery({
    queryKey: ['paymentPlans'],
    queryFn: getPaymentPlans
  });

  return {
    data,
    isLoading,
    isError
  };
};
