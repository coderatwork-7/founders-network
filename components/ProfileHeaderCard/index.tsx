import React, {useCallback, useState} from 'react';

import styles from './ProfileHeaderCard.module.scss';
import Card from '@/ds/Card/card';
import FnText from '@/ds/FnText';
import Avatar from '@/ds/Avatar/avatar';
import Link from 'next/link';
import {IntroMessageButton} from '@/ds/IntroMessageButton';
import useChatModal from '@/hooks/useChatModal';

import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {INotableFounderStats} from '../ProfilePage/profilePage';
import FnDescriptionList from '@/ds/FnDescriptionList';
import FnDescriptionListItem from '@/ds/FnDescriptionListItem';
import SocialLinks, {ISocialLinks} from '../SocialLinks';
import {addURLProtocol} from '@/utils/addURLProtocol';
import IntroRequestModal from '../IntroRequestModal';
import {useSession} from 'next-auth/react';
import {useUserDetailQuery} from '@/genericApi/foundersNetwork/queries/useUserDetailQuery';

interface IProps {
  profileId: string;
  role: 'Investor' | 'Member';
  avatarUrl?: string;
  about?: string;
  badge?: string;
  chapter?: string;
  cohortNominator?: string;
  companyUrl?: string;
  email?: string;
  insiderInformation?: string;
  introRequested?: boolean;
  companyName?: string;
  coverImageUrl?: string;
  firstName: string;
  lastName: string;
  isCompatible?: boolean;
  title?: string;
  expertise?: {id: number; name: string}[];
  notableFounderStats?: INotableFounderStats[];
  socialLinks?: ISocialLinks;
}

export const ProfileHeaderCard: React.FC<IProps> = props => {
  const {
    profileId,
    role,
    avatarUrl,
    about,
    badge,
    chapter,
    cohortNominator,
    companyName,
    companyUrl,
    coverImageUrl,
    email,
    expertise,
    insiderInformation,
    introRequested,
    isCompatible,
    firstName,
    lastName,
    title,
    notableFounderStats,
    socialLinks
  } = props;

  const openChatModal = useChatModal();
  const [showIntroForm, setShowIntroForm] = useState(false);

  const designation = () => {
    if (title && companyName) {
      if (companyUrl) {
        return (
          <div style={{display: 'flex', gap: '.25rem'}}>
            <FnText>{title}, </FnText>
            <a href={addURLProtocol(companyUrl)} target="_blank">
              {companyName}
            </a>
          </div>
        );
      }
    }
    if (title) {
      return <FnText>{title}</FnText>;
    }
    if (companyName && companyUrl) {
      return (
        <Link href={companyUrl} target="_blank">
          {companyName}
        </Link>
      );
    }
    if (companyName) {
      return `${companyName}`;
    }
  };

  const introClickHandler = () => {
    setShowIntroForm(true);
  };

  const user = useSelector(selectUserInfo());

  const handleMessage = () => {
    openChatModal({
      userId: user.id,
      name: user.name,
      profileImage: avatarUrl,
      companyName
    });
  };

  const {data: session} = useSession();

  const userId = session?.user.id;

  const {data: userData} = useUserDetailQuery(userId);

  const hasInvestorContactPermission = userData?.paymentPlan !== 'bootstrap';

  return (
    <Card className={styles.ProfileHeaderCard} bannerImageUrl={coverImageUrl}>
      {showIntroForm && hasInvestorContactPermission && profileId && (
        <IntroRequestModal
          memberName={userData?.name}
          investorId={profileId}
          investorProfileId={profileId}
          investorName={`${firstName} ${lastName}`}
          show={showIntroForm}
          setShow={setShowIntroForm}
          onHide={() => setShowIntroForm(false)}
        />
      )}
      <div className={styles.headerContent}>
        <div className={styles.avatarContainer}>
          <Avatar
            avatarUrl={avatarUrl ?? ''}
            altText={`${firstName} ${lastName}`}
            imageHeight={180}
            imageWidth={180}
            newDesign
            badge={badge}
          />
        </div>

        <div className={styles.topRow}>
          <div className={styles.name}>
            <div className={styles.nameSocialRow}>
              <FnText bold type="heading-sm">
                {`${firstName ?? ''} ${lastName ?? ''}`}
              </FnText>
              {socialLinks && <SocialLinks socialLinks={socialLinks} />}
            </div>
            <FnText>{designation()}</FnText>
            {email && (
              <FnText>
                <a href={`mailto:${email}`}>{email}</a>
              </FnText>
            )}
          </div>
          {!introRequested && (
            <IntroMessageButton
              isCompatible={isCompatible}
              handleIntroClick={introClickHandler}
              handleMessageClick={() => handleMessage()}
            />
          )}
        </div>

        {chapter && (
          <div className={styles.membershipInfo}>
            <FnText type="heading-xSmall" bold>
              Membership Info
            </FnText>
            <FnText>{chapter}</FnText>
            <FnText>{cohortNominator}</FnText>
          </div>
        )}

        {about && (
          <div className={styles.about}>
            <FnText type="heading-xSmall" bold>
              About
            </FnText>
            <FnText>{about}</FnText>
          </div>
        )}
        {insiderInformation && (
          <div className={styles.insiderInfo}>
            <FnText type="heading-xSmall" bold>
              Insider information
            </FnText>
            <FnText type="body">{insiderInformation}</FnText>
          </div>
        )}
        {expertise && expertise.length > 0 && (
          <div className={styles.expertise}>
            <FnText type="heading-xSmall" bold>
              Expertise
            </FnText>
            <ul>
              {expertise.map((expertiseData: {id: number; name: string}) => (
                <Link
                  href={`/members/?expertise=${expertiseData?.id}`}
                  // onClick={handleClick}
                >
                  <li key={expertiseData.id}>{expertiseData.name}</li>
                </Link>
              ))}
            </ul>
          </div>
        )}
        {notableFounderStats && (
          <div className={styles.notableStats}>
            <FnText type="heading-xSmall" bold>
              Notable Founder Stats
            </FnText>
            <FnDescriptionList>
              {notableFounderStats.map(stat => {
                if (
                  stat.name !== 'Capital Raised' &&
                  stat.name !== 'Value of Exits' &&
                  stat.value !== 0
                )
                  return (
                    <FnDescriptionListItem
                      title={stat.name}
                      description={stat.value}
                    />
                  );
              })}
            </FnDescriptionList>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeaderCard;
