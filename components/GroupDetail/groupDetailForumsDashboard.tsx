import {CONST_GROUPS_FORUMS} from '@/utils/common/constants';
import {Dashboard} from '../Common/Facets/dashboard';
import {initialStateGroupsDetailForumsFacets} from '../ContextProviders/GroupsDetailForumsFacetsContext';
import InfiniteScroll from 'react-infinite-scroller';
import {Spinner} from '@/ds/Spinner';
import SelectorWrapper from '../Common/selectorWrapper';
import ForumCard from '../Cards/Forum/forumCard';
import {selectForumPost} from '@/store/selectors';
import {GroupDetailForumsFacets} from './groupDetailForumsFacets';
import {keyExtractorForGDP} from './groupDetailMembersDashboard';

export const GroupDetailForumsDashboard = (
  <Dashboard
    apiName="getForumPosts"
    initialState={initialStateGroupsDetailForumsFacets}
    keyExtractorFn={keyExtractorForGDP}
    baseQueryKey={CONST_GROUPS_FORUMS}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <GroupDetailForumsFacets apply={apply} />
        <InfiniteScroll
          loadMore={!isFetchingNextPage ? loadMore : () => {}}
          hasMore={hasNextPage}
          loader={
            <div className="p-2 text-center" key={-2}>
              <Spinner />
            </div>
          }
          threshold={3000}
          initialLoad={false}
        >
          {data?.map((id: string) => (
            <SelectorWrapper
              key={id}
              id={id}
              selector={selectForumPost}
              Component={ForumCard}
            />
          ))}
          {!hasNextPage && !data?.length && (
            <div className="text-center w-100 mt-4">No Forum Posts Found!</div>
          )}
        </InfiniteScroll>
      </>
    )}
  />
);
