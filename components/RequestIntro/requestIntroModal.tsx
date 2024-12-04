import React, {useEffect, useState} from 'react';
import classes from './requestIntroModal.module.scss';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import useAPI from '@/utils/common/useAPI';
import {IntroRequestEditor} from './introRequestEditor';
import {useSelector} from 'react-redux';
import {selectProfileData, selectUserInfo} from '@/store/selectors';
import {IntroProfileInfo} from '@/hooks/useIntroModal';
import {ROLES} from '@/utils/common/constants';

export interface RequestIntroModalProps {
  profileInfo: IntroProfileInfo;
  handleCloseModal: () => void;
}

export const RequestIntroModal: React.FC<RequestIntroModalProps> = React.memo(
  ({profileInfo, handleCloseModal}) => {
    const api = useAPI();
    const [introRequested, setIntroRequested] = useState(false);
    const userInfo = useSelector(selectUserInfo());
    const userProfileData = useSelector(selectProfileData(userInfo?.profileId));

    useEffect(() => {
      const fetchProfileData = async () => {
        await api('getUserProfile', {profileId: userInfo?.profileId});
      };

      if (!userProfileData && userInfo?.profileId) {
        fetchProfileData();
      }
    }, [userInfo?.profileId]);

    const postIntroRequest = (message: string) => {
      return api(
        'postIntroRequest',
        {
          userId: userInfo?.id,
          profileId: profileInfo.profileId,
          isPartner: [
            ROLES.PARTNER_FULL_ACCESS,
            ROLES.PARTNER_LIMITED
          ].includes(profileInfo.role)
        },
        {method: 'POST', data: {message}}
      );
    };

    return (
      <Modal
        show={true}
        onHide={handleCloseModal}
        enforceFocus={false}
        className={clsx(!introRequested && classes.modal)}
        animation={!introRequested}
        centered={introRequested}
      >
        <Modal.Header closeButton className="py-3 border-0">
          <Modal.Title
            className={clsx([
              classes.modalTitle,
              introRequested ? 'fs-6' : 'text-truncate'
            ])}
          >
            {introRequested
              ? 'Introduction Request Submitted'
              : 'Request Intro'}
          </Modal.Title>
        </Modal.Header>
        {!introRequested && (
          <Modal.Body>
            <div>
              <IntroRequestEditor
                userData={userProfileData}
                recipientData={profileInfo}
                handleSubmitRequest={postIntroRequest}
                setIntroRequested={setIntroRequested}
              />
            </div>
          </Modal.Body>
        )}
      </Modal>
    );
  }
);
