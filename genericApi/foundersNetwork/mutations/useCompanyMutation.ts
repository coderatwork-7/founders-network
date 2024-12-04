import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';
import {useCallback} from 'react';

export const useCompanyMutation = () => {
  const queryClient = useQueryClient();

  const {data: session} = useSession();

  const profileId = session?.user?.profileId;

  const putCompany = useCallback(
    async (company: any) => {
      return await axios.put(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${profileId}/company`,
        company,
        {
          headers: {
            authorization: `Bearer ${session?.user.tokens.access}`
          }
        }
      );
    },
    [session]
  );

  return useMutation({
    mutationFn: putCompany,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['company']);
    }
  });
};
