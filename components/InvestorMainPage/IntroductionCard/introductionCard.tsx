import Card from '@/ds/Card/card';

import styles from './introductionCard.module.scss';
import Avatar from '@/ds/Avatar/avatar';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface CompanyDetails {
  name: string;
  website: string;
  logoUrl: string;
  description: string;
  sector: string;
  stage: string;
  investors: string;
  location: string;
  lookingToRaise: string;
  targetMarket: string;
  monetization: string;
  monthlyRevenue: string;
  revenueGrowthRate: string;
  newUserGrowthRate: string;
  currentFunding: string;
}

interface UserProfile {
  id: number;
  name: string;
  avatarUrl: string;
  receivedOn: string;
  status: string;
  numberOfStartupsRun: number;
  totalValueOfExits: string;
  lifetimeFunding: string;
  numberOfEmployeesHired: number;
  company: CompanyDetails;
}

interface IntroductionCardPropstype {
  userProfile: UserProfile;
}

const CompnayInfo = [
  {
    title: 'Sector',
    value: 'sector'
  },
  {
    title: 'Stage',
    value: 'stage'
  },
  {
    title: 'Investors',
    value: 'investors'
  },
  {
    title: 'Location',
    value: 'location'
  },
  {
    title: 'Looking To Raise',
    value: 'lookingToRaise'
  }
];

const LifetimeFounderStats = [
  {
    title: 'Number Of Startups',
    value: 'numberOfStartupsRun'
  },
  {
    title: 'Value of Exits',
    value: 'totalValueOfExits'
  },
  {
    title: 'Lifetime Funding',
    value: 'lifetimeFunding'
  },
  {
    title: 'Employees Hired',
    value: 'numberOfEmployeesHired'
  }
];

const CompanyStats = [
  {
    title: 'Looking to Raise',
    value: 'lookingToRaise'
  },
  {
    title: 'Target Marketing',
    value: 'targetMarket'
  },
  {
    title: 'Monetization',
    value: 'monetization'
  },
  {
    title: 'Monthly Revenue',
    value: 'monthlyRevenue'
  },
  {
    title: 'Revenue Growth Rate',
    value: 'revenueGrowthRate'
  },
  {
    title: 'New User Growth Rate',
    value: 'newUserGrowthRate'
  },
  {
    title: 'Current Funding',
    value: 'currentFunding'
  },
  {
    title: 'Investors',
    value: 'investors'
  }
];

export const IntroductionCard: React.FC<IntroductionCardPropstype> = ({
  userProfile
}) => {
  const company = userProfile?.company;
  return (
    <Card className={styles.cardContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.imageContainer}>
          <Avatar
            avatarUrl={userProfile?.avatarUrl}
            altText={userProfile?.name}
            newDesign
            imageHeight={120}
            imageWidth={120}
          />
          <div className={clsx('my-1', styles.companyLogoContainer)}>
            <img
              src={userProfile?.company?.logoUrl}
              alt={userProfile?.company?.name}
              className={styles.companyLogo}
            />
          </div>
        </div>
        <div>
          <div>Received On</div>
          <div>{userProfile?.receivedOn}</div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className="my-1">
          <span className={styles.userName}>{userProfile?.name}</span> of{' '}
          <Link href={userProfile?.company?.website} target="_blank">
            {userProfile?.company?.name}
          </Link>
        </div>
        <div className="my-1">{userProfile?.company?.description}</div>
        <div className={styles.companyInfo}>
          {CompnayInfo?.map(item => {
            return (
              <div key={item.title}>
                <span className={styles.title}>{item.title}: </span>
                <span> {company?.[item.value as keyof CompanyDetails]}</span>
              </div>
            );
          })}
        </div>

        <Card className={styles.statsContainer}>
          <h5 className="fw-bold">Lifetime Founder Stats</h5>
          {LifetimeFounderStats?.map(item => {
            return (
              <div key={item?.title} className={styles.statsTag}>
                <div className={styles.title}>{item?.title}: </div>
                {/* @ts-ignore */}
                <div>{userProfile[item.value]}</div>
              </div>
            );
          })}
        </Card>
        <Card className={styles.statsContainer}>
          <h5 className="fw-bold">{userProfile?.company?.name} Stats</h5>
          {CompanyStats?.map(item => {
            return (
              <div key={item?.title} className={styles.statsTag}>
                <div className={styles.title}>{item?.title}: </div>
                {/* @ts-ignore */}
                <div>{company[item.value]}</div>
              </div>
            );
          })}
        </Card>
      </div>
    </Card>
  );
};
