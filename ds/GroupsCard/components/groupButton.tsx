import {Button, ButtonVariants} from '@/ds/Button';
import {JOIN_TYPES} from '../groupsCard';
import classes from '../groupsCard.module.scss';
import {useState} from 'react';

interface GroupButtonProps {
  groupId: string;
  isPrivate: boolean;
  isInviteRequested: boolean;
  isJoined: boolean;
  joinType: JOIN_TYPES;
  joinGroup: (groupId: string, isPrivate: boolean) => Promise<any>;
  buttonClass?: string;
}

export const GroupButton: React.FC<GroupButtonProps> = ({
  groupId,
  isPrivate,
  isInviteRequested,
  isJoined,
  joinType,
  joinGroup,
  buttonClass
}) => {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    joinGroup(groupId, isPrivate)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  if (isJoined || isInviteRequested) {
    return (
      <Button
        variant={ButtonVariants.BluePrimary}
        className={buttonClass ?? classes.btn}
        disabled
        textUppercase
      >
        {isJoined ? 'Joined' : 'Requested'}
      </Button>
    );
  } else if ([JOIN_TYPES.OPEN, JOIN_TYPES.PRIVATE].includes(joinType)) {
    return (
      <Button
        variant={ButtonVariants.BluePrimary}
        className={buttonClass ?? classes.btn}
        disabled={loading}
        textUppercase
        onClick={handleClick}
        loading={loading}
        loadingChildren={isPrivate ? 'Requesting' : 'Joining'}
      >
        {isPrivate ? 'Request Invite' : 'Join Group'}
      </Button>
    );
  }
  return <></>;
};
