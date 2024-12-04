import React, {useCallback, useState} from 'react';

import styles from './InvestmentSettings.module.scss';
import {useSession} from 'next-auth/react';
import {useQuery} from '@tanstack/react-query';
import Card from '@/ds/Card/card';
import FnDescriptionList from '@/ds/FnDescriptionList';
import FnDescriptionListItem from '@/ds/FnDescriptionListItem';
import FnText from '@/ds/FnText';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencil} from '@fortawesome/free-solid-svg-icons';
import FnIconButton from '@/ds/FnIconButton';

import InvestmentSettingsForm from './InvestmentSettingsForm';

interface IProps {}

export const InvestmentSettings: React.FC<IProps> = props => {
  const {} = props;

  const {data: session} = useSession();

  const [showEditForm, setShowEditForm] = useState(false);

  const getInvestorDetails = useCallback(async () => {
    if (session?.user?.id) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user?.id}/investment-settings`,
        {
          headers: {
            authorization: `Bearer ${session?.user.tokens.access}`
          }
        }
      );

      return await res.json();
    }
  }, [session]);

  const getSavePreferences = useCallback(async () => {
    if (session?.user?.profileId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/investor/${session?.user.profileId}/save_preferences`,
        {
          headers: {
            authorization: `Bearer ${session?.user.tokens.access}`
          }
        }
      );

      return await res.json();
    }
  }, [session]);

  const getOverview = useCallback(async () => {
    if (session?.user?.profileId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user.id}/overview`,
        {
          headers: {
            authorization: `Bearer ${session?.user.tokens.access}`
          }
        }
      );

      return await res.json();
    }
  }, [session]);

  const {data: investorDetails, isLoading: investorDetailsLoading} = useQuery({
    queryKey: ['investorDetails'],
    queryFn: getInvestorDetails,
    enabled: !!session?.user?.id
  });

  const {data: overviewData, isLoading: overviewDataLoading} = useQuery({
    queryKey: ['overview'],
    queryFn: getOverview,
    enabled: !!session?.user?.id
  });

  const {data: savePreferences, isLoading: isLoadingSavePreferences} = useQuery(
    {
      queryKey: ['savePreferences'],
      queryFn: getSavePreferences,
      enabled: !!session?.user?.profileId
    }
  );

  const investmentLocations = savePreferences?.locations
    ?.map((location: {id: number; name: string}, index: number) => {
      if (index < savePreferences?.locations?.map.length) {
        return `${location.name},`;
      } else return location.name;
    })
    .join(' ');

  const sectors = savePreferences?.sectors
    ?.map((sector: {id: number; title: string}, index: number) => {
      if (index < savePreferences?.sectors?.map.length) {
        return `${sector.title},`;
      } else return sector.title;
    })
    .join(' ');

  const handleEditForm = () => {
    setShowEditForm(prevState => !prevState);
  };

  return (
    <div className={styles.InvestmentSettings}>
      <div className={styles.heading}>
        <FnText type="heading-lg">Investment Preferences</FnText>
        <FnIconButton
          icon={
            <FontAwesomeIcon
              icon={faPencil}
              size="1x"
              title="Edit Profile Settings"
            />
          }
          onClick={handleEditForm}
        />
      </div>
      <Card>
        {!showEditForm ? (
          <FnDescriptionList>
            <FnDescriptionListItem
              title="Invests in"
              description={investorDetails?.stage}
            />
            <FnDescriptionListItem
              title="Investment locations"
              description={investmentLocations}
            />
            <FnDescriptionListItem title="Sectors" description={sectors} />
            <FnDescriptionListItem
              title="Investment range"
              description={overviewData?.overview?.investmentRange}
            />
            <FnDescriptionListItem
              title="Insider information"
              description={overviewData?.overview?.insiderInformation}
            />
          </FnDescriptionList>
        ) : (
          <InvestmentSettingsForm setShowEditForm={setShowEditForm} />
        )}
      </Card>
    </div>
  );
};

export default InvestmentSettings;
