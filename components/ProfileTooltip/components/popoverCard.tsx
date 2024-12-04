import React, {useCallback, useEffect} from 'react';
import {MembersCard as MiniProfileCard} from '@/ds/CommonCards';
import classes from '../profileTooltip.module.scss';
import {Spinner} from '@/ds/Spinner';
import clsx from 'clsx';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectMiniProfile} from '@/store/selectors';
import useChatModal from '@/hooks/useChatModal';

export interface ProfileDetails {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  badge: string;
  avatarUrl: string;
  dateTime: {
    creationDate: string;
  };
  designation: string;
  companyName: string;
  expertise: {
    name: string;
    id: string;
  }[];
  objectives?: {
    [key: string]: string;
    first: string;
    second: string;
    third: string;
  };
  priorities: string;
  city: {
    name: string;
    id: string;
  };
  stage: {
    name: string;
    id: string;
  };
  sector: {
    name: string;
    id: string;
  }[];
  cohort?: string;
  introRequested?: boolean;
}

export const PopoverCard: React.FC<{id: number | string}> = ({id}) => {
  const makeApiCall = useAPI();
  const profileData: ProfileDetails = useSelector(selectMiniProfile(id));
  const openChatModal = useChatModal();

  const fetchData = useCallback(async () => {
    if (!profileData) {
      await makeApiCall('getMiniProfile', {
        profileId: id
      });
    }
  }, [id, makeApiCall]);

  const handleMessage = (user: any) => {
    openChatModal({
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      profileImage: user.avatarUrl,
      companyName: user.companyName
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={classes.card}>
      {!profileData ? (
        <div
          className={clsx(
            'd-flex justify-content-center align-items-center',
            classes.spinner
          )}
        >
          <Spinner />
        </div>
      ) : (
        <MiniProfileCard
          data={profileData}
          popoverCard
          messageClickHandler={() => handleMessage(profileData)}
        />
      )}
    </div>
  );
};
