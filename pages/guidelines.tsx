import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import {Guidelines} from '@/components/Guidelines';
import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Home(): JSX.Element {
  useAuth();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  return (
    <>
      <Head>
        <title>Forum Guidelines | Founders Network</title>
      </Head>

      <main className={`${styles.main} pageLayout`}>
        <Guidelines />
      </main>
    </>
  );
}
