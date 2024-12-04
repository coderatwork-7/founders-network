import SettingsPage from '@/components/SettingsPage';
import Head from 'next/head';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Settings(): JSX.Element {
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  return (
    <>
      <Head>
        <title>Settings | Founders Network</title>
        <meta charSet="utf-8" />
      </Head>
      <main>
        <SettingsPage />
      </main>
    </>
  );
}
