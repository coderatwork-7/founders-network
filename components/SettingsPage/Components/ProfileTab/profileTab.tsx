import React, {useState} from 'react';
import styles from './profileTab.module.scss';

import FnText from '@/ds/FnText';

import FnTabNavigation from '@/ds/FNTabNavigation';
import ProfilePersonalTab from '@/components/ProfilePersonalTab';
import ProfileExperienceTab from '@/components/ProfileExperienceTab';
import ProfileAddressTab from '@/components/ProfileAddressTab';
import ProfileSocialTab from '@/components/ProfileSocialTab';

export interface OptionProps {
  label: string;
  value: number;
}

interface ProfileTabProps {}

const ProfileTab: React.FC<ProfileTabProps> = () => {
  const profileSections = [
    {displayName: 'Personal', tab: 'personal'},
    {displayName: 'Professional', tab: 'experience'},
    {displayName: 'Socials', tab: 'socials'},
    {displayName: 'Chapter & address', tab: 'address'}
  ];

  const [activeTab, setActiveTab] = useState('personal');

  const displayActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return <ProfilePersonalTab />;
      case 'experience':
        return <ProfileExperienceTab />;
      case 'address':
        return <ProfileAddressTab />;
      case 'socials':
        return <ProfileSocialTab />;
      default:
        return <ProfilePersonalTab />;
    }
  };

  return (
    <div className={styles.profileSettings}>
      <FnText type="heading-xl" bold>
        Profile information
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

export default ProfileTab;
