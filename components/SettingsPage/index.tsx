import React, {useEffect, useState} from 'react';
import styles from './SettingsPage.module.scss';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {useSearchParams} from 'next/navigation';
import ProfileTab from './Components/ProfileTab/profileTab';
import CompanyTab from './Components/CompanyTab/companyTab';
import {OnboardingTooltip} from '../Onboarding/OnboardingTooltip';
import {BillingTab} from './Components/BillingTab/billingTab';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {useAppSelector} from '@/store/hooks';
import InvestmentSettings from './Components/InvestmentSettings';
import LoginSecurityTab from './Components/LoginSecurityTab';
import FnText from '@/ds/FnText';
import {Button, ButtonVariants} from '@/ds/Button';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsTab from '../NotificationsTab';
import LockIcon from '@mui/icons-material/Lock';
import InvestorProfileTab from '../InvestorProfileTab';

export interface GeneralFormDataProps {
  firstName: string | undefined;
  lastName: string | undefined;
  phoneNo: string | undefined;
  enableSMSReminder: boolean | undefined;
  email: string | undefined;
  secondaryEmail: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  tweets: string | undefined;
  realTimeEmailsPosts: string | undefined;
  realTimeEmailsReplies: string | undefined;
  repliesFirstCount: string | number | boolean | undefined;
  periodicEmailsDailyDigest: string | undefined;
  periodicEmailsWeeklyReacp: string | undefined;
  periodicEmailsUpcomingFunctions: string | undefined;
  periodicEmailsNewCohortPosts: string | undefined;
}

export interface EditFormStateProps {
  general: boolean;
  login: boolean;
  email: boolean;
  profile: boolean;
  company: boolean;
  billing: boolean;
}

const SettingsPage: React.FC = () => {
  const [editForm, setEditForm] = useState<EditFormStateProps>({
    general: false,
    login: false,
    email: false,
    profile: false,
    company: false,
    billing: false
  });

  const isMobile = Breakpoint.mobile === useBreakpoint();
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuTab = searchParams.get('tab');

  useEffect(() => {
    setEditForm({
      general: false,
      login: false,
      email: false,
      profile: false,
      company: false,
      billing: false
    });
  }, [menuTab]);

  const userRole = useAppSelector(state => state.userRepository.userInfo?.role);
  const isInvestor = userRole === 'Investor';

  const getTab = () => {
    if (isInvestor) {
      switch (menuTab) {
        case 'profile':
          return <InvestorProfileTab />;
      }
    }

    switch (menuTab) {
      case 'profile':
        return <ProfileTab />;
      case 'company':
        return <CompanyTab editForm={editForm} setEditForm={setEditForm} />;
      case 'loginSecurity':
        return <LoginSecurityTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'billing':
        return <BillingTab />;
      case 'investing':
        return <InvestmentSettings />;
    }
  };

  return (
    <>
      <div className={clsx(['pageLayout', styles.pageLayout])}>
        <div
          className={clsx(['leftContainer', styles.leftContainerFixedPostion])}
        >
          <ul>
            <li>
              <Button
                className={clsx(styles.navButton, {
                  [styles.chosenTab]: menuTab === 'profile'
                })}
                variant={ButtonVariants.TEXT_ONLY}
                onClick={() =>
                  router.push({pathname: '/settings', query: {tab: 'profile'}})
                }
              >
                <FnText>
                  <AccountCircleIcon />
                  Profile
                </FnText>
              </Button>
            </li>
            {/* {isInvestor ? (
              <li>
                <Button
                  className={clsx(styles.navButton, {
                    [styles.chosenTab]: menuTab === 'investments'
                  })}
                  variant={ButtonVariants.TEXT_ONLY}
                  onClick={() =>
                    router.push({
                      pathname: '/settings',
                      query: {tab: 'investments'}
                    })
                  }
                >
                  <FnText>
                    <BarChartIcon />
                    Investments
                  </FnText>
                </Button>
              </li>
            ) : ( */}
            {!isInvestor && (
              <li>
                <Button
                  className={clsx(styles.navButton, {
                    [styles.chosenTab]: menuTab === 'company'
                  })}
                  variant={ButtonVariants.TEXT_ONLY}
                  onClick={() =>
                    router.push({
                      pathname: '/settings',
                      query: {tab: 'company'}
                    })
                  }
                >
                  <FnText>
                    <ApartmentIcon />
                    Current startup
                  </FnText>
                </Button>
              </li>
            )}
            {/* )} */}
            <li>
              <Button
                className={clsx(styles.navButton, {
                  [styles.chosenTab]: menuTab === 'loginSecurity'
                })}
                variant={ButtonVariants.TEXT_ONLY}
                onClick={() =>
                  router.push({
                    pathname: '/settings',
                    query: {tab: 'loginSecurity'}
                  })
                }
              >
                <FnText>
                  <LockIcon />
                  Login + Security
                </FnText>
              </Button>
            </li>
            <li>
              <Button
                className={clsx(styles.navButton, {
                  [styles.chosenTab]: menuTab === 'notifications'
                })}
                variant={ButtonVariants.TEXT_ONLY}
                onClick={() =>
                  router.push({
                    pathname: '/settings',
                    query: {tab: 'notifications'}
                  })
                }
              >
                <FnText>
                  <NotificationsNoneIcon />
                  Notifications
                </FnText>
              </Button>
            </li>
            <li>
              <Button
                className={clsx(styles.navButton, {
                  [styles.chosenTab]: menuTab === 'billing'
                })}
                variant={ButtonVariants.TEXT_ONLY}
                onClick={() =>
                  router.push({pathname: '/settings', query: {tab: 'billing'}})
                }
              >
                <FnText>
                  <PaymentIcon />
                  Billing
                </FnText>
              </Button>
            </li>
          </ul>

          {!isMobile && <NominationWidget />}
        </div>
        <div
          className={clsx([
            'rightContainer',
            styles.rightContainerFixedPostion
          ])}
        >
          {getTab()}
          <div className={styles.onboarding}>
            <OnboardingTooltip type="profile" position="left" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
