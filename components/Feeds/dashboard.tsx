import React, {useCallback, useState} from 'react';
import styles from './dashboard.module.scss';
import InfiniteScrollerComponent from '../Common/infiniteScrollerComponent';
import MemberCard from '@/components/Cards/Member/memberCard';
import GroupCard from '@/components/Cards/Group/groupCard';
import DealCard from '@/components/Cards/Deal/dealCard';
import ForumCard from '@/components/Cards/Forum/forumCard';
import FunctionCard from '@/components/Cards/Function/functionCard';
import {NoDataFoundError} from '@/genericApi/errors';
import {Spinner} from '@/ds/Spinner';
import {selectFeedIds, selectFeed} from '@/store/selectors';
import {
  TYPE_FUNCTIONS,
  TYPE_FORUMS,
  TYPE_MEMBERS,
  TYPE_DEALS,
  TYPE_GROUPS,
  TYPE_ALL
} from '@/utils/common/commonTypes';
import {
  CONST_FUNCTIONS,
  CONST_FORUMS,
  CONST_MEMBERS,
  CONST_DEALS,
  CONST_GROUPS,
  CONST_ALL,
  NO_OF_POSTS_LOAD_PER_REQUEST
} from '@/utils/common/constants';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import useAPI from '@/utils/common/useAPI';

export type AllFeedsType =
  | TYPE_ALL
  | TYPE_MEMBERS
  | TYPE_FUNCTIONS
  | TYPE_DEALS
  | TYPE_GROUPS
  | TYPE_FORUMS;
interface DashboardPropsType {
  feedsType: AllFeedsType;
  sortby: string;
  query: string;
}
const cards: {[key: string]: Function} = {
  [CONST_MEMBERS]: MemberCard,
  [CONST_GROUPS]: GroupCard,
  [CONST_DEALS]: DealCard,
  [CONST_FORUMS]: ForumCard,
  [CONST_FUNCTIONS]: FunctionCard
};
const reversePrefixes: any = {
  fr: 'forum',
  fn: 'function',
  mm: 'member',
  gp: 'group',
  dl: 'deal'
};
const getCard = (id: string) => {
  const prefix = id.slice(0, 2);
  return cards[reversePrefixes[prefix] + 's'];
};
const getFeedType = (id: string) => {
  return reversePrefixes[id.slice(0, 2)];
};

export default function Dashboard({
  sortby,
  query,
  ...props
}: DashboardPropsType): JSX.Element {
  const api = useAPI();
  const feedsType =
    props.feedsType !== CONST_ALL ? props.feedsType.slice(0, -1) : 'feeds';
  const [hasMore, setHasMore] = useState({
    [CONST_MEMBERS]: true,
    [CONST_GROUPS]: true,
    [CONST_DEALS]: true,
    [CONST_FORUMS]: true,
    [CONST_FUNCTIONS]: true,
    [CONST_ALL]: true
  });

  const invokeGetFeeds = useCallback(
    async (
      offset: number | undefined,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      replaceReduxState: boolean
    ) => {
      if (!offset) offset = 0;
      try {
        await api('getFeeds', {
          feedsType: props.feedsType,
          userId: '5898',
          limit: NO_OF_POSTS_LOAD_PER_REQUEST,
          offset,
          sortby: sortby === 'none' ? undefined : sortby,
          q: query === '' ? undefined : query,
          concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest,
          replaceReduxState
        });
      } catch (err: any) {
        if (err.errorObj instanceof NoDataFoundError)
          setHasMore(prevHasMore => ({
            ...prevHasMore,
            [props.feedsType]: false
          }));
      } finally {
        setLoading(false);
      }
    },
    [props.feedsType, sortby, query]
  );
  return (
    <div className={styles.container}>
      <InfiniteScrollerComponent
        dependency={[sortby, query]}
        loadMore={invokeGetFeeds}
        hasMore={hasMore[props.feedsType]}
        itemComponent={getCard}
        selector={selectFeedIds}
        selectorArgument={feedsType}
        getFeedType={getFeedType}
        loader={<Spinner key={-1} />}
        selectFeed={selectFeed}
      ></InfiniteScrollerComponent>
    </div>
  );
}
