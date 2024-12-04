import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {DealsPageFacetsProvider} from '@/components/ContextProviders/DealsFacetsContext';
import {DealsDashboard} from '@/components/Deals';
import {useSelector} from 'react-redux';
import {selectDeals} from '@/store/selectors';
import Parse from 'html-react-parser';
import {AddDeal} from '@/components/Deals/addDeal';
import classes from '@/styles/Pages.module.scss';
import useAuth from '@/hooks/useAuth';
import {processAnchorTagAndEmoji, replaceAnchorTag} from '@/utils/common/help';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Deals(): JSX.Element {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }
  useAuth();
  const deals = useSelector(selectDeals());
  let dealsInfo: any = deals?.info;
  if (dealsInfo) {
    dealsInfo = (dealsInfo as string).replace(
      /\$[^]*?(?:\s|$)/g,
      match => `<span>${match}</span>`
    );
  }
  return (
    <>
      <Head>
        <title>Deals | Founders Network</title>
      </Head>
      <p className={`${classes.ribbon} ${isMobile ? classes.bigRibbon : ''}`}>
        {Parse(dealsInfo ?? '', {replace: processAnchorTagAndEmoji})}
      </p>
      <DealsPageFacetsProvider>
        <main className={`${styles.main} pageLayout pageWithRibbon`}>
          <div
            className={`leftContainer ${
              !isMobile
                ? `leftContainerFixedPostion ${classes.positionWithRibbon}`
                : ''
            }`}
          >
            <AddDeal />
            {!isMobile && <NominationWidget />}
          </div>

          <div
            className={`rightContainer ${
              !isMobile ? 'rightContainerFixedPostion' : ''
            }`}
          >
            <DealsDashboard />
          </div>
        </main>
      </DealsPageFacetsProvider>
    </>
  );
}
