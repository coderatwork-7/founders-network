import React, {useState} from 'react';
import classes from './conversationList.module.scss';
import {ConversationType} from '@/components/Chat';
import {IconWrapper} from '@/ds/Icons';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import clsx from 'clsx';
import {Spinner} from '@/ds/Spinner';
import InfiniteScroll from 'react-infinite-scroller';
import {toast} from 'react-toastify';
import {ConcurrentApiNotAllowed} from '@/genericApi/errors';
import {Conversation} from '@/components/ChatPopup/components/Conversation';

interface ConversationListProps {
  conversations: Array<ConversationType>;
  loading: boolean;
  hasMoreUsers?: boolean;
  fetchMoreUsers?: () => Promise<any>;
  isSearchList?: boolean;
  handleSelect: (conv: ConversationType) => void;
}

export const ConversationList = ({
  conversations,
  loading,
  fetchMoreUsers,
  hasMoreUsers,
  isSearchList,
  handleSelect
}: ConversationListProps) => {
  const [fetchMoreError, setFetchMoreError] = useState(false);

  const loadMoreUsers = () => {
    if (isSearchList || loading) return;
    setFetchMoreError(false);
    fetchMoreUsers?.().catch(err => {
      if (!(err.errorObj instanceof ConcurrentApiNotAllowed)) {
        setFetchMoreError(true);
        toast.error('Error fetching Conversations!', {
          theme: 'dark'
        });
      }
    });
  };

  const getListContent = () => {
    if (loading) {
      return (
        <div className="text-center pt-5">
          <Spinner />
        </div>
      );
    }

    if (conversations.length === 0) {
      return <NoUsersFound />;
    }

    return conversations.map(conv => (
      <Conversation
        key={conv.userId}
        conversation={conv}
        handleSelect={handleSelect}
        isSearch={isSearchList}
      />
    ));
  };

  return (
    <div className={clsx([classes.container, 'chatPopupScrollBar'])}>
      <div className={classes.listContainer}>
        <InfiniteScroll
          loadMore={loadMoreUsers}
          hasMore={
            !loading &&
            !isSearchList &&
            !fetchMoreError &&
            (hasMoreUsers ?? true)
          }
          loader={
            loading ? (
              <></>
            ) : (
              <div key={-2} className={' p-2 text-center'}>
                <Spinner size="sm" />
              </div>
            )
          }
          threshold={10}
          initialLoad={true}
          useWindow={false}
        >
          <div className={classes.list}>{getListContent()}</div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

const NoUsersFound = () => {
  return (
    <div className="text-center pt-5 ">
      <IconWrapper icon={faUser} className="fa-7x opacity-50" />
      <div className="mt-4 fs-4 fw-bold opacity-50">No Users Found!</div>
    </div>
  );
};
