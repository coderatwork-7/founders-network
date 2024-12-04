import React, {useContext, useState} from 'react';
import classes from './conversationList.module.scss';
import {ConversationType} from '@/components/Chat';
import {Conversation} from '../Conversation';
import {IconWrapper} from '@/ds/Icons';
import {
  faComments,
  faPenToSquare,
  faUser
} from '@fortawesome/free-regular-svg-icons';
import {UserSearch} from '@/components/Chat/UserSearch';
import {faChevronLeft, faXmark} from '@fortawesome/free-solid-svg-icons';
import {ChatContext} from '../ChatContext';
import clsx from 'clsx';
import {Spinner} from '@/ds/Spinner';
import {Button, ButtonVariants} from '@/ds/Button';
import InfiniteScroll from 'react-infinite-scroller';
import {toast} from 'react-toastify';
import {ConcurrentApiNotAllowed} from '@/genericApi/errors';
interface ConversationListProps {
  conversations: Array<ConversationType>;
  onClose: () => void;
  loading: boolean;
  hasMoreUsers?: boolean;
  fetchMoreUsers?: () => Promise<any>;
  isSearchList?: boolean;
  onUserClick: (clickedUser: ConversationType) => void;
}

export const ConversationList = ({
  conversations,
  onClose,
  loading,
  fetchMoreUsers,
  hasMoreUsers,
  isSearchList,
  onUserClick
}: ConversationListProps) => {
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [fetchMoreError, setFetchMoreError] = useState(false);
  const {activeConv, setActiveConv, setUserSearchList, setIsSearchInProgress} =
    useContext(ChatContext);

  const handleSelect = (conv: ConversationType) => {
    if (showUserSearch) setUserSearchList(null);
    setActiveConv(conv);
    setShowUserSearch(false);
  };

  const handleSearch = () => {
    setShowUserSearch(v => !v);
    setUserSearchList(null);
    setIsSearchInProgress(false);
  };

  const handleBack = () => {
    setActiveConv(null);
    onClose();
  };

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
      return showUserSearch ? (
        <NoUsersFound />
      ) : (
        <NoConversations handleSearch={handleSearch} />
      );
    }

    return conversations.map(conv => (
      <Conversation
        key={conv.userId}
        conversation={conv}
        selected={activeConv?.userId === conv.userId}
        handleSelect={handleSelect}
        onUserClick={onUserClick}
      />
    ));
  };

  return (
    <div className={clsx([classes.container, !activeConv && classes.show])}>
      <ConversationListHeader
        handleBack={handleBack}
        handleSearch={handleSearch}
        showUserSearch={showUserSearch}
      />
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

const ConversationListHeader: React.FC<{
  handleBack: () => void;
  handleSearch: () => void;
  showUserSearch: boolean;
}> = ({handleBack, handleSearch, showUserSearch}) => {
  return (
    <div className={classes.header}>
      <span onClick={handleBack} className={classes.iconBack}>
        <IconWrapper icon={faChevronLeft} className="fs-4" />
      </span>
      <span>All Chats</span>
      <span onClick={handleSearch} className={classes.icon}>
        <IconWrapper
          icon={showUserSearch ? faXmark : faPenToSquare}
          className="fs-3"
        />
      </span>
      {showUserSearch && <UserSearch className={classes.userSearch} />}
    </div>
  );
};

const NoConversations: React.FC<{
  handleSearch: () => void;
}> = ({handleSearch}) => {
  return (
    <div className="text-center pt-5 ">
      <IconWrapper icon={faComments} className="fa-7x opacity-50" />
      <div className="mt-5 fs-4 fw-bold opacity-50">No Conversations Yet!</div>
      <div className="fs-5 opacity-50">Reach out and talk to someone!</div>
      <Button
        variant={ButtonVariants.Primary}
        className="mt-3"
        onClick={handleSearch}
      >
        Start a Chat
      </Button>
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
