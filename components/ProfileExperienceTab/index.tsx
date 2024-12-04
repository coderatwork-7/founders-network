import React from 'react';

import styles from './ProfileExperienceTab.module.scss';
import {FormItem} from '../FormItem';
import {founderTypeOptions} from '@/utils/data/founderTypeOptions';

import {Spinner} from 'react-bootstrap';
import {
  useExpertiseQuery,
  useProfileQuery
} from '@/genericApi/foundersNetwork/queries';
import {useSession} from 'next-auth/react';

interface IProps {}

export const ProfileExperienceTab: React.FC<IProps> = props => {
  const {data: session} = useSession();
  const profileId = session?.user.profileId;
  const {data, isLoading} = useProfileQuery(profileId);
  const {data: expertiseData} = useExpertiseQuery();

  const expertiseOptions = expertiseData?.map(
    (option: {key: number; name: string}) => {
      return {value: option.key, label: option.name};
    }
  );

  const expertiseValue = data?.expertise?.map(
    (option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    }
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.ProfileExperienceTab}>
      <FormItem
        endpoint="profile"
        title="Job title"
        name="title"
        value={data?.title}
        placeholder="Enter your job title"
      />
      <FormItem
        endpoint="profile"
        title="Background"
        description="Write a brief bio about your professional experience."
        name="background"
        value={data?.background}
        placeholder="Your background and experience"
      />
      <FormItem
        options={founderTypeOptions}
        endpoint="profile"
        title="Founder type"
        description="What type of founder are you?"
        name="founderType"
        value={data?.founderType}
      />
      <FormItem
        options={expertiseOptions}
        endpoint="profile"
        title="Expertise"
        description="Select areas of expertise which reflect your skillset."
        name="expertise"
        isMulti
        value={expertiseValue}
      />
      <FormItem
        endpoint="profile"
        title="Number of startups founded"
        description="How many startups have you founded?"
        name="careerStats.startupExperience"
        value={data?.careerStats?.startupExperience}
        placeholder="0"
        type="number"
      />
      <FormItem
        endpoint="profile"
        title="Value of exits"
        description="What was your value of exits?"
        name="careerStats.successfulExits"
        value={data?.careerStats?.successfulExits}
        type="number"
      />
      <FormItem
        endpoint="profile"
        title="Capital raised"
        description="How much capital have you raised?"
        name="careerStats.lifetimeFundingRaised"
        value={data?.careerStats?.lifetimeFundingRaised}
        placeholder="0"
        type="number"
      />
    </div>
  );
};

export default ProfileExperienceTab;
