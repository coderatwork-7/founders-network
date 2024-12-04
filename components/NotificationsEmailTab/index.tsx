import React from 'react';

import styles from './NotificationsEmailTab.module.scss';
import NotificationPreferenceFormItem from '../NotificationPreferenceFormItem';
import {useGeneralQuery} from '@/genericApi/foundersNetwork/queries';

interface IProps {}

export const NotificationsEmailTab: React.FC<IProps> = props => {
  const {} = props;

  const {data: generalData, isLoading: generalIsLoading} = useGeneralQuery();
  const postsValues = [
    {label: 'All', value: 'all'},
    {label: 'My expertise', value: 'myExpertise'},
    {label: 'None', value: 'none'}
  ];

  const periodicEmailValues = [
    {label: 'Send it!', value: 'true'},
    {label: `Don't send it.`, value: 'false'}
  ];

  return (
    <div className={styles.NotificationsEmailTab}>
      <NotificationPreferenceFormItem
        name="realTimeEmails.posts"
        title="Posts"
        description="Would you like every post sent to your inbox, only those matching your expertise, or none?"
        endpoint="general"
        value={generalData?.realTimeEmails?.posts}
        radioValues={postsValues}
      />
      <NotificationPreferenceFormItem
        name="realTimeEmails.replies"
        title="Replies"
        description="Would you like every reply sent to your inbox, only those matching your expertise, or none?."
        endpoint="general"
        value={generalData?.realTimeEmails?.replies}
        radioValues={postsValues}
      />
      <NotificationPreferenceFormItem
        name="periodicEmails.weeklyRecap"
        title="Daily digest"
        description="Would you like every reply sent to your inbox, only those matching your expertise, or none?."
        endpoint="general"
        value={generalData?.periodicEmails?.dailyDigest}
        radioValues={periodicEmailValues}
      />
      <NotificationPreferenceFormItem
        name="periodicEmails.weeklyRecap"
        title="Weekly recap"
        description="Would you like a recap of the week sent to your inbox?"
        endpoint="general"
        value={generalData?.periodicEmails?.weeklyRecap}
        radioValues={periodicEmailValues}
      />
      <NotificationPreferenceFormItem
        name="periodicEmails.newCohortPosts"
        title="New cohort posts"
        description="Would you like posts from new cohorts sent to your inbox?"
        endpoint="general"
        value={generalData?.periodicEmails?.newCohortPosts}
        radioValues={periodicEmailValues}
      />
      <NotificationPreferenceFormItem
        name="periodicEmails.upcomingFunctions"
        title="Upcoming functions"
        description="Would you like to be emailed about upcoming functions?"
        endpoint="general"
        value={generalData?.periodicEmails?.upcomingFunctions}
        radioValues={periodicEmailValues}
      />
    </div>
  );
};

export default NotificationsEmailTab;
