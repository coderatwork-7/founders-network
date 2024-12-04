import React from 'react';
import Head from 'next/head';
import {CreateForumFeed} from '@/components/CreateForumFeed';
import styles from '@/styles/Home.module.scss';
import ForumDashboard from '@/components/Forum';
import {ForumFacetsProvider} from '@/components/ContextProviders/ForumFacetsContext';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Forum(): JSX.Element {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }

  return (
    <>
      <Head>
        <title>Forum | Founders Network</title>
      </Head>
      <main className={`${styles.main} pageLayout`}>
        <div
          className={`leftContainer ${
            !isMobile ? 'leftContainerFixedPostion' : ''
          }`}
        >
          <CreateForumFeed />
          {!isMobile && <NominationWidget />}
        </div>
        <div
          className={`rightContainer ${
            !isMobile ? 'rightContainerFixedPostion' : ''
          }`}
        >
          <ForumFacetsProvider>{ForumDashboard}</ForumFacetsProvider>
        </div>
      </main>
    </>
  );
}
