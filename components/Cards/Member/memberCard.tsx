import MemberTitle from '@/components/Cards/Member/memberTitle';
import DisplayDateTime from '@/components/Common/displayDateTime';
import Card from '@/ds/Card/card';
import CardHeader from '@/ds/Card/cardHeader';
import {TYPE_MEMBERS} from '@/utils/common/commonTypes';
import CardFooter from '@/ds/Card/cardFooter';
import {LikeHeart} from '@/components/Common/likeHeart';
import {CONST_MEMBERS} from '@/utils/common/constants';
import {Divider} from '@/ds/Divider/divider';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
interface MemberCardResponse {
  id: string;
  type: TYPE_MEMBERS;
  author: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  datetime: {
    creationDate: string;
  };
  nominated: string;
  like: {
    count: number;
    liked: boolean;
    profile: {
      id: number;
      name: string;
    }[];
  };
}

interface MemberCardProps {
  data: MemberCardResponse;
}
export default function MemberCard({
  data: {
    id,
    datetime: {creationDate},
    author: {name, avatarUrl, badge, profileId},
    nominated,
    like: {count: likeCount, liked: isLiked, profile: likedBy},
    type = CONST_MEMBERS
  }
}: MemberCardProps): JSX.Element {
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
          <MemberTitle
            authorName={name}
            profileId={profileId}
            nominated={nominated}
          />

          <DisplayDateTime creationDate={creationDate} />
        </div>
      </CardHeader>
      <Divider />
      <CardFooter>
        <div className="horizontalDisplayer">
          <LikeHeart
            count={likeCount}
            isLiked={isLiked}
            likedBy={likedBy}
            id={id}
            feedsType={type}
            feedsTypeMapping={CONST_MEMBERS}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
