import React from 'react';
import localFont from 'next/font/local';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import DashboardHome from '@/components/Feeds';
import {CreateForumFeed} from '@/components/CreateForumFeed';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {HomeFacetsProvider} from '@/components/ContextProviders/HomeFacetsContext';
import {Onboarding} from '@/components/Onboarding';
import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

const lato = localFont({src: '../public/fonts/Lato-Light.woff'});

export default function Home(): JSX.Element {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  useAuth();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }

  return (
    <>
      <Head>
        <title>Home Feed | Founders Network</title>
      </Head>

      <main className={`${styles.main} pageLayout`}>
        <div
          className={`leftContainer ${
            !isMobile ? 'leftContainerFixedPostion' : ''
          }`}
        >
          <CreateForumFeed />
          {!isMobile && (
            <>
              <NominationWidget />
            </>
          )}
        </div>
        <div
          className={`rightContainer ${
            !isMobile ? 'rightContainerFixedPostion' : ''
          }`}
        >
          <HomeFacetsProvider>{DashboardHome}</HomeFacetsProvider>
        </div>
      </main>
      <Onboarding />
    </>
  );
}
