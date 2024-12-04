import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useUpdatePaymentMethodMutation = () => {
  const {data: session} = useSession();
  const putPaymentMethod = async (sessionId: string) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/change-payment-method/`,
      {sessionId},
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );
  };

  return useMutation({
    mutationFn: putPaymentMethod
  });
};
