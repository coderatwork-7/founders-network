import React, {useState} from 'react';

import styles from './LoginSecurityTab.module.scss';
import FnText from '@/ds/FnText';
import PasswordFormItem from '@/components/FormItem/PasswordFormItem';
import FnTabNavigation from '@/ds/FNTabNavigation';
import LoginLoginTab from '@/components/LoginLoginTab';

interface IProps {}

export const LoginSecurityTab: React.FC<IProps> = props => {
  const {} = props;

  const profileSections = [
    {displayName: 'Login', tab: 'login'}
    // {displayName: 'Login requests', tab: 'loginRequests'},
    // {displayName: 'Shared access', tab: 'sharedAccess'}
  ];

  const [activeTab, setActiveTab] = useState('login');

  const displayActiveTab = () => {
    switch (activeTab) {
      case 'login':
        return <LoginLoginTab />;
    }
  };

  return (
    <div className={styles.LoginSecurityTab}>
      <FnText type="heading-xl" bold>
        Login + Security
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

export default LoginSecurityTab;
