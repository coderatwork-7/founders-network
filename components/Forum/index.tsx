import ForumFacets from './forumFacets';
import InfiniteScroll from 'react-infinite-scroller';
import {selectForumPost} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import ForumCard from '@/components/Cards/Forum/forumCard';
import SelectorWrapper from '../Common/selectorWrapper';
import {initialStateForumFacets} from '../ContextProviders/ForumFacetsContext';
import {Dashboard} from '../Common/Facets/dashboard';
import {CONST_FORUMS} from '@/utils/common/constants';

const ForumDashboard = (
  <Dashboard
    apiName="getForumPosts"
    initialState={initialStateForumFacets}
    render={(apply, loadMore, hasNextPage, data, isFetchingNextPage) => (
      <>
        <ForumFacets apply={apply} />
        <InfiniteScroll
          loadMore={!isFetchingNextPage ? loadMore : () => {}}
          hasMore={hasNextPage}
          loader={<Spinner key={-2} />}
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
    baseQueryKey={CONST_FORUMS}
  />
);
export default ForumDashboard;
