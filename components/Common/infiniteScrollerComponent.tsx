import {RootState} from '@/store';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useSelector} from 'react-redux';
import withData from '@/components/Cards/HOC/withData';
import {Spinner} from '@/ds/Spinner';

type loadMoreType = (
  page: number | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  replaceReduxState: boolean
) => void;
interface InfiniteScrollerComponentProps {
  hasMore: boolean;
  loadMore: loadMoreType;
  loader?: JSX.Element;
  threshold?: number;
  selector: (feedType: string) => (state: RootState) => unknown;
  selectorArgument: any;
  itemComponent: Function;
  getFeedType: Function;
  selectFeed: Function;
  dependency: string[];
}

export default function InfiniteScrollerComponent({
  hasMore,
  loadMore,
  loader,
  threshold,
  selector,
  itemComponent,
  getFeedType,
  selectorArgument,
  selectFeed,
  dependency
}: InfiniteScrollerComponentProps): JSX.Element {
  const ids: any = useSelector(selector(selectorArgument));
  const alreadyRequestedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    loadMore(ids?.length, setLoading, false);
    alreadyRequestedRef.current = true;
  }, [ids, alreadyRequestedRef.current]);
  //Case where first and second request are executed sequentially

  useEffect(() => {
    if (!alreadyRequestedRef.current) {
      setLoading(true);
      loadMore(0, setLoading, true);
    }
  }, dependency);

  useEffect(() => {
    alreadyRequestedRef.current = false;
  });
  if (loading) return <Spinner />;
  return (
    <InfiniteScroll
      loadMore={load as () => {}}
      hasMore={hasMore}
      loader={loader ?? <p key="-2">Loading...</p>}
      threshold={threshold ?? 10}
    >
      {ids !== undefined &&
        ids.map((id: number | string) => {
          const Card = withData(
            id,
            selectFeed.bind({}, getFeedType(id)),
            itemComponent(id)
          );
          return <Card key={id} />;
        })}
    </InfiniteScroll>
  );
}
