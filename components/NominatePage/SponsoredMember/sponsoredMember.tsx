import {
  ProfileAvatarTooltip,
  ProfileNameTooltip
} from '@/components/ProfileTooltip';
import {Button, ButtonVariants} from '@/ds/Button';
import Card from '@/ds/Card/card';
import styles from './sponsoredMember.module.scss';
import Link from 'next/link';
import clsx from 'clsx';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import useChatModal from '@/hooks/useChatModal';
import FnText from '@/ds/FnText';

interface MemberPropsType {
  name: string;
  userId: number;
  profileId: number;
  avatarUrl: string;
  badge: string;
  cohort: string;
}
interface SponsoredMemberPropsType {
  sponsoredMembers: MemberPropsType[];
}

export const SponsoredMember = ({
  sponsoredMembers
}: SponsoredMemberPropsType) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const openChatModal = useChatModal();

  const handleNoSponsorLink = () => {
    window.scrollTo({
      top: 0,
      left: 0
    });
  };

  const handleMessageClick = (sponsoredUser: any) => {
    openChatModal({
      userId: sponsoredUser?.userId,
      name: sponsoredUser.name,
      profileImage: sponsoredUser.avatarUrl
    });
  };

  return (
    <Card className={styles.cardContainer}>
      <FnText type="heading-xSmall" bold>
        Your Sponsored Members
      </FnText>

      <div>
        {sponsoredMembers?.length !== 0 ? (
          sponsoredMembers?.map((item: MemberPropsType, index: number) => {
            const lastMember = sponsoredMembers?.length - 1 !== index;

            return (
              <div
                key={index}
                className={clsx(
                  'd-flex justify-content-between',
                  isMobile && 'flex-column gap-2 ',
                  lastMember && styles.sponsoredContainer
                )}
              >
                <div className="d-flex gap-3">
                  <ProfileAvatarTooltip
                    avatarUrl={item.avatarUrl ?? ''}
                    badge={item.badge}
                    id={item.profileId ?? 0}
                    name={item.name ?? ''}
                    newDesign
                  />
                  <div>
                    <ProfileNameTooltip
                      linkClassName={styles.profileName}
                      name={item.name}
                      id={item.profileId}
                    />
                    <h6 className="mt-1">{item.cohort}</h6>
                  </div>
                </div>
                <div>
                  <Button
                    className={styles.messageButton}
                    variant={ButtonVariants.BluePrimary}
                    textUppercase
                    onClick={() => handleMessageClick(item)}
                  >
                    Message
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <FnText>You do not have any Sponsored Members yet.</FnText>
        )}
      </div>
    </Card>
  );
};
