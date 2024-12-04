import React from 'react';
import Head from 'next/head';
import styles from './Investors.module.scss';
import classes from '@/styles/Pages.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {InvestorsDashboard} from '@/components/Investors';
import {InvestorsPageFacetsProvider} from '@/components/ContextProviders/InvestorsFacetsContext';
import clsx from 'clsx';
import {RemainingIntrosWidget} from '@/components/Investors/remainingIntrosWidget';

import {CONST_INVESTORS} from '@/utils/common/constants';
import {useSelector} from 'react-redux';
import {selectFacets, selectInvestmentSettings} from '@/store/selectors';
import useAuth from '@/hooks/useAuth';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

import InvestorStatusWidget from '@/components/Investors/investorStatusWidget';

export default function Members(): JSX.Element {
  useAuth();
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const investmentData = useSelector(selectInvestmentSettings());
  const facets = useSelector(selectFacets(CONST_INVESTORS));
  const userInfo = useSelector(selectUserInfo());
  const userRole = userInfo?.role;

  if (userRole === ROLES.GUEST) {
    router.push('/function/all');
  }

  return (
    <>
      <Head>
        <title>Investors | Founders Network</title>
      </Head>
      <p
        className={clsx([
          classes.ribbon,
          classes.green,
          isMobile && classes.bigRibbon
        ])}
      >
        <a
          target="_blank"
          href="https://foundersnetworkfund.com/investor-program/"
        >
          Invite your investors to be part of the [fn]Investor Program here.
        </a>
      </p>
      <InvestorsPageFacetsProvider>
        <main className={clsx([styles.main, 'pageLayout pageWithRibbon'])}>
          <div
            className={`leftContainer ${
              !isMobile
                ? `leftContainerFixedPostion ${classes.positionWithRibbon}`
                : ''
            }`}
          >
            {!isMobile && <NominationWidget />}
            <RemainingIntrosWidget />
          </div>
          <div
            className={`rightContainer ${
              !isMobile ? 'rightContainerFixedPostion' : ''
            }`}
          >
            {userRole !== ROLES.INVESTOR && <InvestorStatusWidget />}

            {investmentData && facets && InvestorsDashboard}
          </div>
        </main>
      </InvestorsPageFacetsProvider>
    </>
  );
}
