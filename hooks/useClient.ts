import axios from 'axios';
import {useSession} from 'next-auth/react';

export const useClient = () => {
  const {data: session} = useSession();
  const baseURL = `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}`;

  return axios.create({
    baseURL,
    headers: {
      authorization: `Bearer ${session?.user.tokens.access}`
    }
  });
};
