import React, {useCallback} from 'react';
import Card from '@/ds/Card/card';
import styles from './avatarInfoCard.module.scss';
import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faAngellist,
  faFacebook,
  faLinkedin,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';
import {faLink, faPencil} from '@fortawesome/free-solid-svg-icons';
import Avatar from '@/ds/Avatar/avatar';
import {IntroMessageButton} from '@/ds/IntroMessageButton';
import useChatModal from '@/hooks/useChatModal';
import {ProfileData} from '@/types/profile';
import {Session} from 'next-auth';
import {useRouter} from 'next/router';
import useIntroModal from '@/hooks/useIntroModal';
interface AvatarInfoCardProps {
  profileData: ProfileData;
  userInfo: Session['user'];
}

const AvatarInfoCard: React.FC<AvatarInfoCardProps> = ({
  profileData,
  userInfo
}) => {
  const router = useRouter();
  const currentProfileId = router.query?.profileId;

  const openChatModal = useChatModal();
  const openIntroModal = useIntroModal();

  const introClickHandler = useCallback(() => {
    openIntroModal({
      profileId: profileData.id.toString(),
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      role: profileData.role
    });
  }, [profileData]);

  const handleMessage = (user: any) => () => {
    openChatModal({
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      profileImage: user.avatarUrl,
      companyName: user.companyName
    });
  };

  return (
    <Card className={styles.photoCard}>
      <div className={styles.iconsContainer}>
        {Number(currentProfileId) === userInfo?.profileId && (
          <Link href={{pathname: '/settings', query: {tab: 'general'}}}>
            <FontAwesomeIcon icon={faPencil} size="1x" title="Edit Profile" />
          </Link>
        )}
        {profileData?.socialLinks?.linkedin && (
          <Link href={`${profileData?.socialLinks?.linkedin}`} target="_blank">
            <FontAwesomeIcon
              icon={faLinkedin}
              size="1x"
              title={`${profileData?.firstName}'s Linkedin`}
            />
          </Link>
        )}

        {profileData?.socialLinks?.twitter && (
          <Link href={`${profileData?.socialLinks?.twitter}`} target="_blank">
            <FontAwesomeIcon
              icon={faXTwitter}
              size="1x"
              title={`${profileData?.firstName}'s Twitter`}
            />
          </Link>
        )}
        {profileData?.socialLinks?.facebook && (
          <Link href={`${profileData?.socialLinks.facebook}`} target="_blank">
            <FontAwesomeIcon
              icon={faFacebook}
              size="1x"
              title={`${profileData?.firstName}'s Facebook`}
            />
          </Link>
        )}
        {profileData?.socialLinks?.angelList && (
          <Link href={`${profileData?.socialLinks.angelList}`} target="_blank">
            <FontAwesomeIcon
              icon={faAngellist}
              size="1x"
              title={`${profileData?.firstName}'s AngelList`}
            />
          </Link>
        )}
      </div>
      <div className={styles.avatarContainer}>
        <Avatar
          newDesign={true}
          avatarUrl={profileData?.avatarUrl}
          altText={'Profile Image'}
          imageHeight={178}
          imageWidth={178}
          badge={profileData?.badge}
        />
      </div>
      <div className={styles.textContainer}>
        <h1>{`${profileData?.firstName} ${profileData?.lastName}`}</h1>
        <p>
          {profileData?.title && `${profileData?.title}`}&nbsp;
          {profileData?.company?.name && `· ${profileData?.company.name}`}
        </p>
        <p>{profileData?.chapter && `${profileData?.chapter} Chapter`}</p>
        <p>
          {profileData?.cohortNominator
            ? `${profileData?.cohortNominator}`
            : ''}
        </p>
        <p>{profileData?.email && `${profileData?.email}`}</p>
      </div>
      <div className={styles.introButton}>
        {!profileData?.introRequested && (
          <IntroMessageButton
            handleIntroClick={introClickHandler}
            handleMessageClick={handleMessage(profileData)}
          />
        )}
      </div>
    </Card>
  );
};

export default AvatarInfoCard;
