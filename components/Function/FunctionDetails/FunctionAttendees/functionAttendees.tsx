import Card from '@/ds/Card/card';
import {useState} from 'react';
import styles from './functionAttendees.module.scss';
import {
  ProfileAvatarTooltip,
  ProfileNameTooltip
} from '@/components/ProfileTooltip';
import {Button, ButtonVariants} from '@/ds/Button';
import {ROLES} from '@/utils/common/constants';
import Avatar from '@/ds/Avatar/avatar';
import Link from 'next/link';

interface CountType {
  inPerson: number;
  dialIn: number;
}

interface ListType {
  name: string;
  profileId: number;
  avatarUrl: string;
  badge: string;
  companyName: string;
  userRole: string;
}

interface AttendeesType {
  list: ListType[];
  count: CountType;
}

interface FunctionAttendeesPropsType {
  attendees: AttendeesType;
}

export const FunctionAttendees = ({attendees}: FunctionAttendeesPropsType) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const numattendeesLength = attendees?.list?.length;
  const numAttendesToshow = expanded
    ? numattendeesLength
    : Math.min(6, numattendeesLength);
  const inPerson = attendees?.count?.inPerson;
  const dialIn = attendees?.count?.dialIn;
  return (
    <Card className="px-4 py-4">
      <div className="mb-4 d-flex">
        <h6 className="fw-bold text-uppercase">
          {inPerson !== 0 ? inPerson + ' attendees ' : ''}
          {inPerson && dialIn ? 'and' : ''}
          {dialIn !== 0 ? dialIn + ' dial-ins' : ''}
        </h6>
      </div>
      <div className={styles.listContainer}>
        {attendees?.list
          ?.slice(0, numAttendesToshow)
          ?.map((element: ListType) => {
            return (
              <div key={element.profileId} className="d-flex gap-2 text-start">
                {element?.userRole !== ROLES.INVESTOR ? (
                  <ProfileAvatarTooltip
                    name={element?.name}
                    id={element.profileId}
                    avatarUrl={element?.avatarUrl}
                    badge={element?.badge}
                    badgeHeight={15}
                    badgeWidth={15}
                  />
                ) : (
                  <Avatar
                    newDesign
                    avatarUrl={element?.avatarUrl}
                    altText={element?.name}
                    profileURL={`/investor/${element?.profileId}`}
                  />
                )}
                <div>
                  {element?.userRole !== ROLES.INVESTOR ? (
                    <ProfileNameTooltip
                      name={element?.name}
                      id={element?.profileId}
                    />
                  ) : (
                    <Link href={`/investor/${element?.profileId}`}>
                      {element?.name}
                    </Link>
                  )}
                  <div className={styles.listCompanyName}>
                    {element?.companyName}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {numAttendesToshow >= 6 && (
        <Button
          className={styles.expandButton}
          variant={ButtonVariants.BluePrimary}
          onClick={() => setExpanded(!expanded)}
          textUppercase
        >
          {expanded ? 'Collapse' : 'Expand All+'}
        </Button>
      )}
    </Card>
  );
};
