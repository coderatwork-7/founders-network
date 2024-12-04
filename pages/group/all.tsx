import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {GroupsPageFacetsProvider} from '@/components/ContextProviders/GroupsFacetsContext';
import {GroupsDashboard} from '@/components/Group';
import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Groups(): JSX.Element {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  useAuth();
  return (
    <>
      <Head>
        <title>Groups | Founders Network</title>
      </Head>
      <GroupsPageFacetsProvider>
        <main className={`${styles.main} pageLayout`}>
          <div
            className={`leftContainer ${
              !isMobile ? 'leftContainerFixedPostion' : ''
            }`}
          >
            {!isMobile && <NominationWidget />}
          </div>
          <div
            className={`rightContainer ${
              !isMobile ? 'rightContainerFixedPostion' : ''
            }`}
          >
            {GroupsDashboard}
          </div>
        </main>
      </GroupsPageFacetsProvider>
    </>
  );
}
