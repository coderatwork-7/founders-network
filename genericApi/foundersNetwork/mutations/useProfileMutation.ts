import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';
import {useCallback} from 'react';

export const useProfileMutation = () => {
  const queryClient = useQueryClient();

  const {data: session} = useSession();

  const profileId = session?.user?.profileId;

  const putProfile = useCallback(
    async (profile: any) => {
      return await axios.put(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${profileId}/profile`,
        profile,
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
    mutationFn: putProfile,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['profile']);
    }
  });
};
