import React from 'react';
import Head from 'next/head';
import {NOMINATE_PAGE_TITLE} from '@/utils/common/constants';
import {NominatePage} from '@/components/NominatePage';
import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Nominate(): JSX.Element {
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  useAuth();
  return (
    <>
      <Head>
        <title>{NOMINATE_PAGE_TITLE}</title>
        <meta charSet="utf-8" />
      </Head>
      <main className={`pageLayout`}>
        <div className={`centerContainer`}>
          <NominatePage />
        </div>
      </main>
    </>
  );
}
