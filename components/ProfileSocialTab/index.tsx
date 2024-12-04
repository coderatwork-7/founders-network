import React from 'react';

import styles from './ProfileSocialTab.module.scss';
import {FormItem} from '../FormItem';
import {useProfileQuery} from '@/genericApi/foundersNetwork/queries';
import {useSession} from 'next-auth/react';

interface IProps {}

export const ProfileSocialTab: React.FC<IProps> = props => {
  const {} = props;

  const {data: session} = useSession();
  const profileId = session?.user.profileId;
  const {data, isLoading} = useProfileQuery(profileId);

  return (
    <div className={styles.ProfileSocialTab}>
      <FormItem
        endpoint="profile"
        description="Enter your twitter username"
        title="Twitter"
        name="socialInfo.twitterUsername"
        value={data?.socialInfo?.twitterUsername}
        placeholder="Twitter handle"
        url={`https://www.twitter.com/${data?.socialInfo?.twitterUsername}`}
        displayType={data?.socialInfo?.twitterUsername ? 'link' : undefined}
      />
      <FormItem
        endpoint="profile"
        description="Enter your Facebook username"
        title="Facebook"
        name="socialInfo.facebookUsername"
        value={data?.socialInfo?.facebookUsername}
        placeholder="Facebook handle"
        url={`https://www.facebook.com/${data?.socialInfo?.facebookUsername}`}
        displayType={data?.socialInfo?.facebookUsername ? 'link' : undefined}
      />
      <FormItem
        endpoint="profile"
        description="Enter your LinkedIn username"
        title="LinkedIn"
        name="socialInfo.linkedinUsername"
        value={data?.socialInfo?.linkedinUsername}
        placeholder="LinkedIn handle"
        url={`https://www.linkedin.com/in/${data?.socialInfo?.linkedinUsername}`}
        displayType={data?.socialInfo?.linkedinUsername ? 'link' : undefined}
      />
      <FormItem
        endpoint="profile"
        description="Enter your Angel List handle"
        title="Angel List"
        name="socialInfo.angelListUsername"
        value={data?.socialInfo?.angelListUsername}
        placeholder="Angel List handle"
        url={`https://www.angellist.com/${data?.socialInfo?.angelListUsername}`}
        displayType={data?.socialInfo?.angelListUsername ? 'link' : undefined}
      />
      <FormItem
        endpoint="profile"
        description="if you'd like us to contact you via whatsApp, please add your number."
        title="Whatsapp"
        name="socialInfo.whatsappNumber"
        value={data?.socialInfo?.whatsappNumber}
        placeholder="Angel List handle"
        // url={`https://www.twitter.com/${data?.socialInfo?.whatsappNumber}`}
        // displayType={data?.socialInfo?.whatsappNumber ? 'link' : undefined}
      />
    </div>
  );
};

export default ProfileSocialTab;
