import FunctionContent from './functionContent';
import QuestionFunctionTitle from './questionFunctionTitle';
import RsvpFunctionTitle from './rsvpFunctionTitle';
import PostFunctionTitle from './postFunctionTitle';
import Card from '@/ds/Card/card';
import CardHeader from '@/ds/Card/cardHeader';
import {
  TYPE_POST,
  TYPE_RSVP,
  TYPE_QUESTION,
  TYPE_FUNCTIONS
} from '@/utils/common/commonTypes';
import {CONST_POST, CONST_RSVP, CONST_QUESTION} from '@/utils/common/constants';
import CardContent from '@/ds/Card/cardContent';
import CardFooter from '@/ds/Card/cardFooter';
import {Divider} from '@/ds/Divider/divider';
import {LikeHeart} from '@/components/Common/likeHeart';
import {ProfileAvatarTooltip} from '@/components/ProfileTooltip';
import {AddToCalendar} from '@/components/AddToCalendar';
import {isPast} from 'date-fns';

export interface PostFunctionCard {
  id: string;
  functionId: string;
  type: TYPE_FUNCTIONS;
  subtype: TYPE_POST;
  author: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  title: string;
  creationTimestamp: string;
  media: {
    imageSrc: string;
    altText: string;
  };
  details: {
    startDate: string;
    startTimePT: string;
    startTimeET: string;
    endDate: string;
  };
  like: {
    count: number;
    liked: boolean;
    profile: {
      id: number;
      name: string;
    }[];
  };
  addTicketsBtn: boolean;
  removeTicketBtn: boolean;
  isDeclined: boolean;
}

export interface RsvpFunctionCard {
  id: string;
  functionId: string;
  type: TYPE_FUNCTIONS;
  subtype: TYPE_RSVP;
  author: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  attendies: {
    profileId: number;
    name: string;
  }[];
  extraAttendiesCount: number;
  creationTimestamp: string;
  title: string;
  media: {
    imageSrc: string;
    altText: string;
  };
  details: {
    startDate: string;
    startTimePT: string;
    startTimeET: string;
    endDate: string;
  };
  like: {
    count: number;
    liked: boolean;
    profile: {
      id: number;
      name: string;
    }[];
  };
  addTicketsBtn: boolean;
  removeTicketBtn: boolean;
  isDeclined: boolean;
}

export interface QuestionFunctionCard {
  id: string;
  functionId: string;
  type: TYPE_FUNCTIONS;
  subtype: TYPE_QUESTION;
  author: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  title: string;
  media: {
    imageSrc: string;
    altText: string;
  };
  details: {
    startDate: string;
    startTimePT: string;
    startTimeET: string;
    endDate: string;
  };
  like: {
    count: number;
    liked: boolean;
    profile: {
      id: number;
      name: string;
    }[];
  };
  addTicketsBtn: boolean;
  removeTicketBtn: boolean;
  isDeclined: boolean;
}

export type FunctionDataTypes =
  | RsvpFunctionCard
  | PostFunctionCard
  | QuestionFunctionCard;
interface FunctionCardProps {
  data: FunctionDataTypes;
}
type FunctionComponentTypes =
  | ((props: RsvpFunctionCard) => JSX.Element)
  | ((props: PostFunctionCard) => JSX.Element)
  | ((props: QuestionFunctionCard) => JSX.Element);

export default function FunctionCard({data}: FunctionCardProps): JSX.Element {
  const SubtypeMap: {[key: string]: FunctionComponentTypes} = {
    [CONST_POST]: PostFunctionTitle,
    [CONST_QUESTION]: QuestionFunctionTitle,
    [CONST_RSVP]: RsvpFunctionTitle
  };
  const Title: any = SubtypeMap[data.subtype];
  const pastEvent = isPast(new Date(data.details.endDate));

  return (
    <Card feedsType={data.type}>
      <CardHeader feedsType={data.type} className="w-100">
        <ProfileAvatarTooltip
          avatarUrl={data.author.avatarUrl}
          badge={data.author.badge}
          id={data.author.profileId}
          name={data.author.name}
        />
        <div>
          <Title {...data} />
        </div>
        <div className="ms-auto">
          <AddToCalendar
            functionId={data.functionId}
            showPopover
            popoverPlacement="bottom"
          />
        </div>
      </CardHeader>

      <Divider />
      <CardContent>
        <FunctionContent
          functionId={data.functionId}
          title={data.subtype === CONST_RSVP ? data.title : undefined}
          image={data.media.imageSrc}
          subtype={data.subtype}
          imageAltText={data.media.altText}
          addTicketsBtn={data.addTicketsBtn}
          removeTicketBtn={data.removeTicketBtn}
          isDeclined={data.isDeclined}
          isPastEvent={pastEvent}
        />
      </CardContent>
      {data.media.imageSrc || data.subtype === CONST_RSVP ? <Divider /> : null}
      <CardFooter>
        <div className="horizontalDisplayer">
          <LikeHeart
            count={data.like.count}
            isLiked={data.like.liked}
            likedBy={data.like.profile}
            id={data.id}
            feedsType={data.type}
            feedsTypeMapping={data.subtype}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
