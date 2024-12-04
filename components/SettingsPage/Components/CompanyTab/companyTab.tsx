import React, {useState} from 'react';
import styles from './companyTab.module.scss';
import {EditFormStateProps} from '../../index';
import FnText from '@/ds/FnText';
import CompanyGeneralTab from '@/components/CompanyGeneralTab';
import FnTabNavigation from '@/ds/FNTabNavigation';

import CompanyFundraisingTab from '@/components/CompanyFundraisingTab';
import CompanyPitchdeckTab from '@/components/CompanyPitchdeckTab';
import CompanyTractionInformationTab from '@/components/CompanyTractionInformationTab';

export interface SelectInputsProps {
  label: string;
  value: number | string;
}

export interface CompanyTabFormDataProps {
  companyName: string;
  websiteUrl: string | undefined;
  companyLogoUrl: string | undefined;
  pitchDeckUrl: string | undefined;
  location: SelectInputsProps | undefined;
  companyUpdates: string | undefined;
  sectors: {id?: string | number; value?: string | number; name: string}[] | [];
  investmentSector: {id?: string; value?: string; name: string}[] | [];
  companyBlog: string | undefined;
  stage: SelectInputsProps | undefined;
  accelerator: SelectInputsProps[] | [];
  monetizationStrategy: SelectInputsProps[] | [];
  targetMarket: SelectInputsProps | undefined;
  revenueGrowthRateMoM: string | undefined;
  newUserGrowthRateMoM: string | undefined;
  currentMonthlyRevenue: SelectInputsProps | undefined;
  priorities: string | undefined;
  investors: string | undefined;
  lookingToRaise: string | undefined;
  customers: string | undefined;
  revenue: string | undefined;
  currentFunding: string | undefined;
  employeesHired: number | undefined;
  launchDate: string | undefined;
  burnRate: string | undefined;
  cashOnHands: string | undefined;
  monthsOfRunway: string | undefined;
  lookingForCofounder: string | undefined;
  totalUsers: number | undefined;
  companyDescription: string | undefined;
}

interface CompanyTabProps {
  setEditForm: React.Dispatch<React.SetStateAction<EditFormStateProps>>;
  editForm: EditFormStateProps;
}

const CompanyTab: React.FC<CompanyTabProps> = () => {
  const profileSections = [
    {displayName: 'General', tab: 'general'},
    {displayName: 'Startup progress', tab: 'tractionInformation'},
    // {displayName: 'Fundraising', tab: 'fundraising'},
    {displayName: 'Pitch deck', tab: 'pitchdeck'}
  ];

  const [activeTab, setActiveTab] = useState('general');

  const displayActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return <CompanyGeneralTab />;
      case 'tractionInformation':
        return <CompanyTractionInformationTab />;
      case 'fundraising':
        return <CompanyFundraisingTab />;
      case 'pitchdeck':
        return <CompanyPitchdeckTab />;
      default:
        return <CompanyGeneralTab />;
    }
  };

  return (
    <div className={styles.companySettings}>
      <FnText type="heading-xl" bold>
        Company Information
      </FnText>

      <FnTabNavigation
        tabs={profileSections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className={styles.activeTabContainer}>{displayActiveTab()}</div>
    </div>
  );
};

export default CompanyTab;
