import React, {useState} from 'react';

import styles from './NotificationsTab.module.scss';
import FnText from '@/ds/FnText';
import FnTabNavigation from '@/ds/FNTabNavigation';
import {FormItem} from '../FormItem';
import {useGeneralQuery} from '@/genericApi/foundersNetwork/queries';
import {Button} from '@/ds/Button';
import FnModal from '@/ds/FnModal';
import NotificationPreferenceFormItem from '../NotificationPreferenceFormItem';
import NotificationsEmailTab from '../NotificationsEmailTab';

interface IProps {}

export const NotificationsTab: React.FC<IProps> = props => {
  const {} = props;

  const notificationSections = [{displayName: 'Email', tab: 'email'}];

  const [activeTab, setActiveTab] = useState('email');

  const displayActiveTab = () => {
    switch (activeTab) {
      case 'email':
        return <NotificationsEmailTab />;
      default:
        return <NotificationsEmailTab />;
    }
  };

  return (
    <div className={styles.NotificationsTab}>
      <FnText type="heading-xl" bold>
        Notifications
      </FnText>

      <FnTabNavigation
        tabs={notificationSections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className={styles.activeTabContainer}>{displayActiveTab()}</div>
    </div>
  );
};

export default NotificationsTab;
