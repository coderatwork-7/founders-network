import {useSession} from 'next-auth/react';
import {useEffect} from 'react';
import {getTokenExpirationTimeInMinutes} from '@/utils/common/helper';

export default function RefreshTokenHandler(props: any) {
  const {data: session} = useSession();
  useEffect(() => {
    if (!!session) {
      const accessTokenExpiry = session?.user?.tokens?.accessExpirationTime;
      const timeRemaining = getTokenExpirationTimeInMinutes(accessTokenExpiry);
      props.setInterval(timeRemaining > 0 ? timeRemaining * 60 : 0);
    }
  }, [session, useSession]);

  return null;
}
