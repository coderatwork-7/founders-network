import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {PartnersPageFacetsProvider} from '@/components/ContextProviders/PartnersFacetsContext';
import {PartnersDashboard} from '@/components/Partners';
import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Partners(): JSX.Element {
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
        <title>Partners | Founders Network</title>
      </Head>
      <PartnersPageFacetsProvider>
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
            {PartnersDashboard}
          </div>
        </main>
      </PartnersPageFacetsProvider>
    </>
  );
}
