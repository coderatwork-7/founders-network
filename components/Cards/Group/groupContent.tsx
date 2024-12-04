import Link from 'next/link';
import classes from './groupContent.module.scss';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import {GroupButton} from '@/ds/GroupsCard/components/groupButton';
import {JOIN_TYPES} from '@/ds/GroupsCard/groupsCard';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
interface GroupContentProps {
  groupId: string;
  members: {
    id: number;
    name: string;
    badge: string;
    avatarUrl: string;
  }[];
  additionalMemberCount: number;
  isPrivate: boolean;
  isInviteRequested: boolean;
  isJoined: boolean;
  joinType: JOIN_TYPES;
}
export default function GroupContent({
  groupId,
  members,
  additionalMemberCount,
  isPrivate,
  isInviteRequested,
  isJoined,
  joinType
}: GroupContentProps): JSX.Element {
  const api = useAPI();
  const {id: userId} = useSelector(selectUserInfo()) ?? {};

  const handleJoinGroup = (groupId: string, isPrivate: boolean) => {
    return api(
      isPrivate ? 'postRequestGroupInvite' : 'postJoinGroup',
      {userId, groupId},
      {method: 'POST'}
    );
  };
  return (
    <>
      <div className={classes.avatars}>
        {members.map(profile => (
          <ProfileAvatarTooltip
            key={profile.id}
            avatarUrl={profile.avatarUrl}
            badge={profile.badge}
            id={profile.id}
            name={profile.name}
          />
        ))}
      </div>
      <div className={classes.mainline}>
        and <Link href={`/group/${groupId}`}>{additionalMemberCount} more</Link>{' '}
        are already members
      </div>
      <div className={classes.buttonContainer}>
        <GroupButton
          groupId={groupId}
          isPrivate={isPrivate}
          isInviteRequested={isInviteRequested}
          isJoined={isJoined}
          joinType={joinType}
          joinGroup={handleJoinGroup}
        />
      </div>
    </>
  );
}
