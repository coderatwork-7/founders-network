import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';
import {useCallback} from 'react';

export const useProfileImageMutation = () => {
  const queryClient = useQueryClient();

  const {data: session} = useSession();

  const profileId = session?.user?.profileId;

  const putGeneral = useCallback(
    async (company: any) => {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${profileId}/profile-image`,
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
    mutationFn: putGeneral,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['profile']);
    }
  });
};
