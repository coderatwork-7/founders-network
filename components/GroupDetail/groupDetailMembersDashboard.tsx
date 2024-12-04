import {CONST_GROUPS_MEMBERS} from '@/utils/common/constants';
import {Dashboard} from '../Common/Facets/dashboard';
import InfiniteScroll from 'react-infinite-scroller';
import {Spinner} from '@/ds/Spinner';
import {initialStateGroupsDetailMembersFacets} from '../ContextProviders/GroupsDetailMembersFacetsContext';
import {GroupDetailMembersFacets} from './groupDetailMembersFacets';
import {MembersList} from '../Members/membersList';
import {FacetState} from '@/utils/common/commonTypes';

export const keyExtractorForGDP = (facetState: FacetState) =>
  Object.keys(facetState ?? {}).filter(key => key !== 'groupId');
export const GroupDetailMembersDashboard = (
  <Dashboard
    apiName="getMembersPageFeeds"
    initialState={initialStateGroupsDetailMembersFacets}
    baseQueryKey={CONST_GROUPS_MEMBERS}
    keyExtractorFn={keyExtractorForGDP}
    render={(apply, loadMore, hasNextPage, data) => (
      <>
        <GroupDetailMembersFacets apply={apply} />
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasNextPage}
          loader={<Spinner key={-2} />}
          threshold={10}
          initialLoad={false}
        >
          {!hasNextPage && !data?.length ? (
            <div className="text-center w-100 mt-4">No Members Found!</div>
          ) : (
            <MembersList ids={data} cardType={CONST_GROUPS_MEMBERS} />
          )}
        </InfiniteScroll>
      </>
    )}
  />
);
