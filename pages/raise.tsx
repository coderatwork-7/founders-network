import {UpgradePage} from '@/components/UpgradePage';
import {RAISE_PAGE_TITLE} from '@/utils/common/constants';
import Head from 'next/head';
import styles from '@/styles/Raise.module.scss';
import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Raise() {
  useAuth();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  return (
    <>
      <Head>
        <title>{RAISE_PAGE_TITLE}</title>
        <meta charSet="utf-8" />
      </Head>
      <main className={`pageLayout`}>
        <div className={styles.upgradePage}>
          <UpgradePage />
        </div>
      </main>
    </>
  );
}
