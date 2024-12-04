import {signOut, useSession} from 'next-auth/react';
import {useEffect} from 'react';
import {getTokenExpirationTimeInMinutes} from '@/utils/common/helper';
import {useRouter} from 'next/router';
import {REFRESH_JWT_TOKEN_API_URL} from '@/utils/common/constants';
import axios from 'axios';

interface TokenResponse {
  data?: {
    token: {
      refresh: string;
      refreshExpirationTime: string;
      access: string;
      accessExpirationTime: string;
    };
    onboarding: any;
  };
}

export default function useAuth() {
  const {data: session, update} = useSession();
  const router = useRouter();

  useEffect(() => {
    const tokenExpirationTime = session?.user?.tokens.accessExpirationTime;
    const refreshToken = session?.user?.tokens.refresh;
    const timeDifferenceInMinutes = getTokenExpirationTimeInMinutes(
      tokenExpirationTime ?? ''
    );

    if (session && (timeDifferenceInMinutes < 0 || !timeDifferenceInMinutes)) {
      // Get a new set of tokens with a refreshToken
      const url = `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${REFRESH_JWT_TOKEN_API_URL}`;
      axios
        .post(url, {
          refresh: refreshToken
        })
        .then((tokenResponse: TokenResponse) => {
          update({
            tokens: {
              ...tokenResponse?.data?.token
            }
          });
        })
        .catch(e => {
          console.log(e?.code);
          signOut();
        });
    }
  }, [session, router, update]);
}
