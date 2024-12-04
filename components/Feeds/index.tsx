import {
  CONST_FORUMS,
  CONST_MEMBERS,
  CONST_DEALS,
  CONST_GROUPS,
  CONST_FUNCTIONS,
  FACET_KEY_TYPE
} from '@/utils/common/constants';
import MemberCard from '@/components/Cards/Member/memberCard';
import GroupCard from '@/components/Cards/Group/groupCard';
import DealCard from '@/components/Cards/Deal/dealCard';
import ForumCard from '@/components/Cards/Forum/forumCard';
import FunctionCard from '@/components/Cards/Function/functionCard';
import {initialStateHomeFacets} from '../ContextProviders/HomeFacetsContext';
import {Dashboard} from '../Common/Facets/dashboard';
import InfiniteScroll from 'react-infinite-scroller';
import HomeFacets from './homeFacets';
import {Spinner} from '@/ds/Spinner';
import SelectorWrapper from '../Common/selectorWrapper';
import {selectFeed} from '@/store/selectors';

const cards: {[key: string]: Function} = {
  [CONST_MEMBERS]: MemberCard,
  [CONST_GROUPS]: GroupCard,
  [CONST_DEALS]: DealCard,
  [CONST_FORUMS]: ForumCard,
  [CONST_FUNCTIONS]: FunctionCard
};
const reversePrefixes: any = {
  fr: 'forums',
  fn: 'functions',
  mm: 'members',
  gp: 'groups',
  dl: 'deals'
};
const getCard = (id: string) => {
  const prefix = id.slice(0, 2);
  return cards[reversePrefixes[prefix]];
};
const getFeedType = (id: string) => {
  return reversePrefixes[id.slice(0, 2)];
};

const typeMapping = {
  all: 'all',
  ['ForumThread']: 'forums',
  ['Function,FnRsvp,FunctionQuestion']: 'functions',
  ['UserProfile,Nomination']: 'members',
  ['MemberToSubgroup']: 'groups',
  ['DealRedemption,FnDeal']: 'deals'
};

const DashboardHome: JSX.Element = (
  <Dashboard
    apiName="getFeeds"
    initialState={initialStateHomeFacets}
    denormalizeIgnoreFacet={[FACET_KEY_TYPE]}
    keyExtractorFn={facetState =>
      Object.keys(facetState).map(key => (key === 'type' ? 'feed_filter' : key))
    }
    payloadModifier={(facetState, payload) =>
      (payload.feedsType =
        typeMapping[
          (Object.keys(facetState?.type ?? {all: true})[0] ??
            'all') as keyof typeof typeMapping
        ])
    }
    processFacetObject={denormalizedFacetObject => {
      if (denormalizedFacetObject?.type) {
        denormalizedFacetObject.feed_filter = denormalizedFacetObject.type;
        delete denormalizedFacetObject.type;
      }
    }}
    baseQueryKey="feeds"
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <HomeFacets apply={apply} />
        <InfiniteScroll
          loadMore={!isFetchingNextPage ? loadMore : () => {}}
          hasMore={hasNextPage}
          loader={
            <div key={-2} className="p-2 text-center">
              <Spinner />
            </div>
          }
          threshold={2500}
          initialLoad={false}
        >
          {data?.map((id: string) => (
            <SelectorWrapper
              key={id}
              id={id}
              Component={getCard(id)}
              selector={selectFeed.bind({}, getFeedType(id))}
            />
          ))}
        </InfiniteScroll>
      </>
    )}
    pageName="home"
  />
);
export default DashboardHome;
