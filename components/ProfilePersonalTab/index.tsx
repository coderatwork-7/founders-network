import React from 'react';

import styles from './ProfilePersonalTab.module.scss';
import {DateFormItem, FormItem} from '../FormItem';
import {MediaFormItem} from '../FormItem/MediaFormItem';
import {educationOptions} from '@/utils/data/educationOptions';
import {usVisaStatusOptions} from '@/utils/data/usVisaStatus';
import {Spinner} from 'react-bootstrap';
import {
  useGeneralQuery,
  useProfileQuery
} from '@/genericApi/foundersNetwork/queries';
import NameFormItem from '../FormItem/NameFormItem';
import AvatarEditor from '../AvatarEditor';
import FnText from '@/ds/FnText';
import {useSession} from 'next-auth/react';

interface IProps {}

export const ProfilePersonalTab: React.FC<IProps> = props => {
  const {data: session} = useSession();
  const profileId = session?.user.profileId;
  const {data, isLoading} = useProfileQuery(profileId);

  const {data: generalData, isLoading: generalIsLoading} = useGeneralQuery();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.ProfilePersonalTab}>
      <div className={styles.avatarContainer}>
        <FnText bold>Profile picture</FnText>
        <AvatarEditor type="profileAvatar" imageUrl={data?.profileImageUrl} />
      </div>

      <NameFormItem
        endpoint="general"
        title="Legal name"
        description="Enter your legal name. You can provide your preferred name in another section."
        firstName={generalData?.firstName}
        lastName={generalData?.lastName}
      />
      <FormItem
        endpoint="general"
        title="Email address"
        description="Enter the best email address for members and investors to contact you."
        value={generalData?.email}
        placeholder="Email Address"
        name="email"
      />
      <FormItem
        endpoint="general"
        title="Secondary email address"
        description="Enter a secondary email address to secure your account."
        value={generalData?.secondaryEmail}
        placeholder="Secondary Email Address"
        name="secondaryEmail"
      />
      <FormItem
        endpoint="general"
        title="Phone number"
        description="Enter the best phone number for members and investors to contact you."
        value={generalData?.phoneNo}
        placeholder="Phone Number"
        name="phoneNo"
      />
      <DateFormItem
        name="birthday"
        endpoint="profile"
        title="Birthday"
        value={data?.birthday}
      />

      <FormItem
        endpoint="profile"
        description="What is your highest level of education?"
        title="Education"
        name="educationLevel"
        value={data?.educationLevel}
        options={educationOptions}
      />
      <FormItem
        endpoint="profile"
        description="What is your US Visa status?"
        title="US visa status"
        name="usVisaStatus"
        value={data?.usVisaStatus}
        options={usVisaStatusOptions}
      />
      <FormItem
        endpoint="profile"
        description="What is your gender?"
        title="Gender"
        name="gender"
        value={data?.gender}
      />

      <MediaFormItem
        name="introductionVideo"
        description="Link a short video about yourself and your startup(s) - we'll attach this to your profile for other members to see"
        title="Introduction video"
        endpoint="profile"
        value={data?.introductionVideo}
      />
    </div>
  );
};

export default ProfilePersonalTab;
