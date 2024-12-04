import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import Card from '@/ds/Card/card';
import {
  faAngellist,
  faFacebookF,
  faLinkedinIn,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import styles from './functionGuests.module.scss';
import {CollapsibleContent} from '@/ds/CollapsibleContent';
import {ROLES} from '@/utils/common/constants';
import Avatar from '@/ds/Avatar/avatar';

interface GuestDetail {
  name: string;
  avatarUrl: string;
  profileUrl: string;
  tags: string[];
  shortDescription: string;
  social: Record<string, string>;
  userRole: string;
  profileId: number;
  badge: string;
}

interface FunctionGuestsPropTypes {
  guestDetails: GuestDetail[];
}

const SocialLinksMapping: any = {
  twitterUrl: faXTwitter,
  linkedinUrl: faLinkedinIn,
  angelUrl: faAngellist,
  facebookUrl: faFacebookF
};

export const FunctionGuest = ({guestDetails}: FunctionGuestsPropTypes) => {
  return (
    <Card>
      {guestDetails?.map((guest: GuestDetail, index: number) => {
        return (
          <div
            key={`${guest?.profileUrl}-${index}`}
            className={styles.cardContainer}
          >
            <div className={styles.profileContainer}>
              <div>
                <h6 className="fw-bold">{guest?.name}</h6>
              </div>
              {guest?.userRole !== ROLES.INVESTOR ? (
                // <ProfileAvatarTooltip
                //   name={guest?.name}
                //   id={guest?.profileId}
                //   avatarUrl={guest?.avatarUrl}
                //   imageHeight={220}
                //   imageWidth={220}
                //   badge={guest?.badge}
                // />
                <Avatar
                  newDesign
                  avatarUrl={guest?.avatarUrl}
                  imageHeight={220}
                  imageWidth={220}
                  altText={guest?.name}
                  profileURL={`/profile/${guest?.profileId}`}
                />
              ) : (
                <Avatar
                  newDesign
                  avatarUrl={guest?.avatarUrl}
                  imageHeight={220}
                  imageWidth={220}
                  altText={guest?.name}
                  profileURL={`/investor/${guest?.profileId}`}
                />
              )}
              <div className="d-flex gap-2 justify-content-center mt-2">
                {Object.keys(guest?.social)?.map((link: any, index: number) => {
                  const linkUrl = guest?.social[link];
                  return (
                    <div
                      key={`${linkUrl}-${index}`}
                      className={styles.socialLinks}
                    >
                      <Link href={linkUrl}>
                        <FontAwesomeIcon
                          className={styles.socialIcon}
                          icon={SocialLinksMapping[link]}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.bioContainer}>
              <h6 className="fw-bold">BIO</h6>
              <div className="d-flex gap-3 mt-3 align-items-center">
                {guest?.tags?.map((tag: string) => {
                  return (
                    <div key={tag} className={styles.tag}>
                      {tag}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <CollapsibleContent
                  mainContent={<div>{guest?.shortDescription}</div>}
                  maxHeight={125}
                />
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
};
