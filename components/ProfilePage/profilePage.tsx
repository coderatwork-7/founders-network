import React, {useEffect, useState} from 'react';
import styles from './profilePage.module.scss';
import {useSelector} from 'react-redux';

import ObjectiveCard from './Components/ObjectiveCard/objectiveCard';
import {selectUserInfo} from '@/store/selectors';
import ProfileHeaderCard from '../ProfileHeaderCard';

import CurrentStartupCard from '../CurrentStartupCard';
import ActivityCard from './Components/ActivityCard/activityCard';
import AvatarInfoCard from './Components/AvatarInfoCard/avatarInfoCard';
import {useSearchParams} from 'next/navigation';
import {useUserQuery} from '@/genericApi/foundersNetwork/queries/useUserQuery';
import {Spinner} from '@/ds/Spinner';
import {useUserDetailQuery} from '@/genericApi/foundersNetwork/queries/useUserDetailQuery';
import {useProfileQuery} from '@/genericApi/foundersNetwork/queries';
import {useSession} from 'next-auth/react';
import {fetchSecure} from '@/utils/common/helper';

export interface INotableFounderStats {
  name: string;
  value: string | number;
}

export const ProfilePage: React.FC = () => {
  const searchParams = useSearchParams();

  const profileId = searchParams.get('profileId');

  const {data: profileData, isLoading} = useUserQuery(profileId);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.profileContent}>
        <ProfileHeaderCard
          badge={profileData?.badge}
          isCompatible
          coverImageUrl={`https://fnprofileimages3.s3.amazonaws.com/production/files/mfd2mef/blurred_austin.jpg`}
          chapter={`${profileData?.chapter ?? 'Unknown'} chapter`}
          cohortNominator={profileData?.cohortNominator}
          avatarUrl={profileData?.avatarUrl}
          firstName={profileData?.firstName}
          lastName={profileData?.lastName}
          about={profileData?.background}
          companyName={profileData?.company?.name}
          companyUrl={profileData?.company?.url}
          title={profileData?.title}
          email={profileData?.email}
          expertise={profileData?.expertise}
          introRequested={profileData?.introRequested}
          profileId={profileData?.id}
          role={profileData?.role}
          notableFounderStats={profileData?.noteableFoundersStats}
          socialLinks={profileData?.socialLinks}
        />
        {profileData?.role !== 'Investor' && (
          <CurrentStartupCard profileData={profileData} />
        )}
        {profileData?.objectives?.length > 0 && (
          <ObjectiveCard profileData={profileData} />
        )}
      </div>
      {/* <AvatarInfoCard profileData={profileData} userInfo={userInfo} /> */}

      {/* <InformationCard profileData={profileData} /> */}
      {/*
      <ActivityCard
        profileData={profileData}
        userInfo={userInfo}
        profileIntroductions={profileIntroductions}
        profileAllUpdates={profileAllUpdates}
      /> */}
    </section>
  );
};
