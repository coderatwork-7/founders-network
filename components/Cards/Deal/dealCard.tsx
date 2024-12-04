import DisplayDateTime from '@/components/Common/displayDateTime';
import DealContent from './dealContent';
import DealTitle from './dealTitle';
import Card from '@/ds/Card/card';
import CardHeader from '@/ds/Card/cardHeader';
import {TYPE_DEALS} from '@/utils/common/commonTypes';
import CardContent from '@/ds/Card/cardContent';
import CardFooter from '@/ds/Card/cardFooter';
import {CONST_DEAL, CONST_DEALS, SCALE} from '@/utils/common/constants';
import {Divider} from '@/ds/Divider/divider';
import {LikeHeart} from '@/components/Common/likeHeart';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
interface DealCardResponse {
  id: string;
  dealId: string;
  type: TYPE_DEALS;
  author: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  datetime: {
    creationDate: string;
    creationTimePT: string;
    creationTimeET: string;
  };
  members: {id: number; name: string}[];
  additionalMemberCount: number;
  details: {
    dealProvider: string;
    title: string;
    image: string;
    allowedTo: string[];
  };
  value: number;
  like: {
    count: number;
    liked: boolean;
    profile: {id: number; name: string}[];
  };
  isRedeemed: boolean;
}

interface DealCardProps {
  data: DealCardResponse;
}
export default function DealCard({
  data: {
    id = '',
    dealId = '',
    type = CONST_DEALS,
    author: {name, avatarUrl, profileId, badge},
    datetime: {creationDate},
    members,
    additionalMemberCount,
    like: {count: likeCount, liked: isLiked, profile: likedBy},
    details: {
      allowedTo = [],
      dealProvider = 'Deal Provider',
      image = '/images/logo_key.png',
      title = 'Deal Title'
    },
    value,
    isRedeemed
  }
}: DealCardProps): JSX.Element {
  const {paymentPlan} = useSelector(selectUserInfo());
  const allowed = allowedTo.includes(paymentPlan);

  const planNames = {
    seriesa: 'lead',
    lifetime: 'lifetime',
    angel: 'scale'
  };

  //@ts-ignore
  const allowedToNewPlanNames = allowedTo.map(item => planNames[item]);

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
          <DealTitle
            authorName={name}
            profileId={profileId}
            memberNames={members}
            additionalMembersCount={additionalMemberCount}
            dealProvider={dealProvider}
          />

          <DisplayDateTime creationDate={creationDate} />
        </div>
      </CardHeader>
      <Divider />
      <CardContent>
        <DealContent
          dealId={dealId}
          dealProvider={dealProvider}
          details={title}
          image={image}
          allowedTo={allowedToNewPlanNames}
          allowed={allowed}
          value={value}
          isRedeemed={isRedeemed}
          plan={SCALE}
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
            feedsTypeMapping={CONST_DEAL}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
