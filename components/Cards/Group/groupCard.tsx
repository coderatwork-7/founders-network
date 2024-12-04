import DisplayDateTime from '@/components/Common/displayDateTime';
import GroupContent from './groupContent';
import GroupTitle from './groupTitle';
import Card from '@/ds/Card/card';
import CardHeader from '@/ds/Card/cardHeader';
import CardFooter from '@/ds/Card/cardFooter';
import {TYPE_GROUPS} from '@/utils/common/commonTypes';
import CardContent from '@/ds/Card/cardContent';
import {CONST_GROUPS} from '@/utils/common/constants';
import {Divider} from '@/ds/Divider/divider';
import {LikeHeart} from '@/components/Common/likeHeart';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import {JOIN_TYPES} from '@/ds/GroupsCard/groupsCard';
interface GroupCardResponse {
  id: string;
  groupId: string;
  type: TYPE_GROUPS;
  author: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  datetime: {
    creationDate: string;
  };
  groupName: string;
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
  details: {
    content: string;
  };
  like: {
    count: number;
    liked: boolean;
    profile: {
      id: number;
      name: string;
    }[];
  };
}

interface GroupCardProps {
  data: GroupCardResponse;
}
export default function GroupCard({
  data: {
    id,
    groupId,
    additionalMemberCount,
    datetime: {creationDate},
    author: {avatarUrl, badge, name, profileId},
    groupName,
    isPrivate,
    isInviteRequested,
    isJoined,
    joinType,
    members,
    type = CONST_GROUPS,
    like: {count: likeCount, liked: isLiked, profile: likedBy}
  }
}: GroupCardProps): JSX.Element {
  return (
    <Card feedsType={type}>
      <CardHeader feedsType={type}>
        <ProfileAvatarTooltip
          avatarUrl={avatarUrl}
          badge={badge}
          id={profileId}
          name={name}
        />
        <div>
          <GroupTitle
            authorName={name}
            profileId={profileId}
            groupName={groupName}
            groupId={groupId}
          />
          <DisplayDateTime creationDate={creationDate} />
        </div>
      </CardHeader>
      <Divider />
      <CardContent>
        <GroupContent
          groupId={groupId}
          members={members}
          isPrivate={isPrivate}
          isInviteRequested={isInviteRequested}
          isJoined={isJoined}
          joinType={joinType}
          additionalMemberCount={additionalMemberCount}
        />
      </CardContent>
      <Divider />
      <CardFooter>
        <div className="horizontalDisplayer">
          <LikeHeart
            count={likeCount}
            isLiked={isLiked}
            likedBy={likedBy}
            id={id}
            feedsType={type}
            feedsTypeMapping={CONST_GROUPS}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
