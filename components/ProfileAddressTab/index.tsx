import React from 'react';

import styles from './ProfileAddressTab.module.scss';
import {AddressFormItem, FormItem} from '../FormItem';
import {useAppSelector} from '@/store/hooks';
import {
  useLocationQuery,
  useProfileQuery
} from '@/genericApi/foundersNetwork/queries';
import {Spinner} from 'react-bootstrap';
import {useSession} from 'next-auth/react';

interface IProps {}

export const ProfileAddressTab: React.FC<IProps> = props => {
  const {data: session} = useSession();
  const profileId = session?.user.profileId;
  const {data, isLoading} = useProfileQuery(profileId);

  const {data: locationData} = useLocationQuery();

  const chapterOptions = locationData?.map(
    (option: {id: number; name: string}) => {
      return {value: option.name, label: option.name};
    }
  );

  const address = {
    billing_address: data?.billingAddress?.billing_address,
    billing_city: data?.billingAddress?.billing_city,
    billing_country: data?.billingAddress?.billing_country,
    billing_state: data?.billingAddress?.billing_state,
    billing_zipcode: data?.billingAddress?.billing_zipcode
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.ProfileAddressTab}>
      <FormItem
        options={chapterOptions}
        endpoint="profile"
        title="Chapter"
        description="Select your chapter."
        name="homeRegion"
        value={data?.homeRegion}
      />
      <AddressFormItem
        endpoint="profile"
        title="Address"
        description="Enter your address."
        value={address}
      />
    </div>
  );
};

export default ProfileAddressTab;
