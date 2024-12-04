import React, {useState} from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import {ObjectivesWidget} from '@/components/Members/objectivesWidget';
import {ObjectivesEditor} from '@/components/Members/objectivesEditor';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {NominationWidget} from '@/components/Nominations/NominationWidget';
import {MembersDashboard} from '@/components/Members';
import {MembersPageFacetsProvider} from '@/components/ContextProviders/MembersFacetsContext';
import {OnboardingTooltip} from '@/components/Onboarding/OnboardingTooltip';
import useAuth from '@/hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {ROLES} from '@/utils/common/constants';
import router from 'next/router';

export default function Members(): JSX.Element {
  const [editingObjectives, setEditingObjectives] = useState(false);
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
        <title>Members | Founders Network</title>
      </Head>
      <MembersPageFacetsProvider>
        <main className={`${styles.main} pageLayout`}>
          <div
            className={`leftContainer ${
              !isMobile ? 'leftContainerFixedPostion' : ''
            }`}
          >
            <ObjectivesWidget setEditingObjectives={setEditingObjectives} />
            <OnboardingTooltip type="objectives" position="left" />
            {!isMobile && <NominationWidget />}
          </div>
          <div
            className={`rightContainer ${
              !isMobile ? 'rightContainerFixedPostion' : ''
            }`}
          >
            {editingObjectives && (
              <ObjectivesEditor setEditingObjectives={setEditingObjectives} />
            )}
            {MembersDashboard}
          </div>
        </main>
      </MembersPageFacetsProvider>
    </>
  );
}
