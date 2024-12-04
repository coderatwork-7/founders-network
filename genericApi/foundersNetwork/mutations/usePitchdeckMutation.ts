import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {useSession} from 'next-auth/react';

export const usePitchdeckMutation = () => {
  const queryClient = useQueryClient();

  const {data: session} = useSession();

  const profileId = session?.user?.profileId;

  const putPitchdeck = async (company: any) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${profileId}/pitch-deck`,
      company,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );
  };

  return useMutation({
    mutationFn: putPitchdeck,
    onSuccess: () => {
      queryClient.invalidateQueries(['company']);
    }
  });
};
