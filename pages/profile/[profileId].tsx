import {ProfilePage} from '@/components/ProfilePage';
import useAuth from '@/hooks/useAuth';

import Head from 'next/head';
import {useRouter} from 'next/router';
import {Spinner} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';

import {useSearchParams} from 'next/navigation';

import {useUserQuery} from '@/genericApi/foundersNetwork/queries/useUserQuery';

export default function Profile(): JSX.Element {
  useAuth();

  const router = useRouter();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }

  return (
    <>
      <Head>
        <title>Profile | Founders Network</title>
        <meta charSet="utf-8" />
      </Head>
      <main>
        <ProfilePage />
      </main>
    </>
  );
}
