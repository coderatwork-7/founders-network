import React, {useEffect, useMemo, useState} from 'react';
import classes from './chatModal.module.scss';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import {ConversationList} from './ConversationList';
import {ChatContext} from './ChatContext';
import {AttachmentType} from './MessageInput/messageInput';
import {MessageBox} from './MessageBox';
import {useDispatch, useSelector} from 'react-redux';
import {selectChatData, selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import {setLastActiveChatUser} from '@/store/reducers/chatReducer';
import {useSession} from 'next-auth/react';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {ConcurrentApiNotAllowed} from '@/genericApi/errors';
import {useRouter} from 'next/router';

export interface ChatModalProps {
  user?: ConversationType;
  handleCloseModal: () => void;
  isMobile?: boolean;
}

export interface ConversationType {
  userId: number;
  name?: string;
  profileUrl?: string;
  profileImage?: string;
  companyName?: string;
  companyUrl?: string;
  unreadCount?: number;
  lastMessageTimeStamp?: string;
  lastMessageTimeAgo?: string;
  messageSample?: string;
}

export interface MessageType {
  messageId?: string;
  sender?: string;
  recipient?: string;
  timestamp?: string;
  timeAgo?: string;
  message?: string;
  attachments?: Array<AttachmentType>;
  sending?: boolean;
}

function convSorter(a: ConversationType, b: ConversationType): number {
  return (
    +new Date(b.lastMessageTimeStamp ?? 0) -
    +new Date(a.lastMessageTimeStamp ?? 0)
  );
}

export const ChatModal: React.FC<ChatModalProps> = React.memo(
  ({user, handleCloseModal, isMobile}) => {
    const api = useAPI();
    const dispatch = useDispatch();
    const {update} = useSession();
    const userInfo = useSelector(selectUserInfo());
    const router = useRouter();
    const {userId: routerUserId} = router.query; // Get the user ID from the router

    const [userSearchList, setUserSearchList] =
      useState<Array<ConversationType> | null>(null);
    const [isSearchInProgress, setIsSearchInProgress] =
      useState<boolean>(false);

    const {info: {data: chatInfo = undefined} = {}, ...chatUsersObj} =
      useSelector(selectChatData());

    const chatUsers = useMemo(
      () =>
        Object.values(chatUsersObj)
          .filter((user: any) => user?.info?.userId)
          .map((user: any) => user.info)
          .sort(convSorter),
      [chatUsersObj]
    );

    const [loadingChats, setLoadingChats] = useState(chatUsers.length === 0);

    const getDefaultConv = () => {
      return (
        chatUsers.find(conv => conv.userId === user?.userId) ??
        user ??
        (isMobile
          ? null
          : chatUsers.find(
              conv => conv.userId === chatInfo?.lastActiveChatUser
            ) ??
            chatUsers.find(conv => conv.unreadCount === 0) ??
            chatUsers[0] ??
            null)
      );
    };

    const [activeConv, setActiveConv] = useState<ConversationType | null>(
      getDefaultConv()
    );

    useEffect(() => {
      const selectedUser = chatUsers.find(
        user => user.userId === Number(routerUserId)
      );
      if (selectedUser && selectedUser.userId !== activeConv?.userId) {
        setActiveConv(prev => selectedUser);
      }
    }, [routerUserId, chatUsers, activeConv?.userId]);

    const handleUserClick = (clickedUser: ConversationType) => {
      setActiveConv(clickedUser);
      if (routerUserId) {
        router.push(`/chat/${clickedUser.userId}`);
      }
    };

    const contextValue = useMemo(
      () => ({
        activeConv,
        setActiveConv,
        setUserSearchList,
        setIsSearchInProgress,
        handleCloseModal,
        handleUserClick
      }),
      [activeConv?.userId]
    );

    const fetchChatUsers = () => {
      if (isSearchInProgress) return Promise.resolve();
      return api('getChatUsers', {
        userId: userInfo?.id ?? '',
        page: (chatInfo?.pageNum ?? 0) + 1,
        concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
      });
    };
    useEffect(() => {
      if (!chatInfo) {
        fetchChatUsers()
          .then(() => setLoadingChats(false))
          .catch(err => {
            if (!(err.errorObj instanceof ConcurrentApiNotAllowed))
              setLoadingChats(false);
          });
      } else if (!activeConv?.lastMessageTimeStamp) {
        setActiveConv(getDefaultConv());
      }
      if (chatInfo) setLoadingChats(false);
    }, [chatInfo]);

    useEffect(() => {
      if (activeConv?.unreadCount) {
        (async () => {
          await api('getViewMessages', {
            userId: userInfo?.id ?? '',
            chatUserId: activeConv?.userId,
            concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
          }).then(() => {
            update({messageCount: userInfo.messageCount - 1});
          });
        })();
      }
    }, [activeConv]);

    const getAllViewMessages = async () => {
      try {
        await api('getAllViewMessages', {
          method: 'GET',
          userId: userInfo?.id ?? '',
          chatUserId: activeConv?.userId,
          concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
        });
        update({messageCount: 0});
      } catch (error) {
        console.error('Error calling getAllViewMessages API:', error);
      }
    };

    const handleClose = () => {
      if (user?.userId !== activeConv?.userId)
        dispatch(setLastActiveChatUser({userId: activeConv?.userId ?? 0}));
      handleCloseModal();
      update({messageCount: 0});
      getAllViewMessages();
    };

    return (
      <Modal
        show={true}
        onHide={handleClose}
        fullscreen={true}
        enforceFocus={false}
      >
        <Modal.Body className={clsx([classes.modalBody])}>
          <button
            type="button"
            className={clsx(['btn-close', classes.close])}
            onClick={handleClose}
          ></button>
          <div className={classes.content}>
            <ChatContext.Provider value={contextValue}>
              <ConversationList
                onClose={handleClose}
                conversations={userSearchList ?? chatUsers}
                isSearchList={userSearchList !== null}
                hasMoreUsers={chatInfo?.hasMore}
                fetchMoreUsers={fetchChatUsers}
                loading={isSearchInProgress || loadingChats}
                onUserClick={handleUserClick}
              />
              <MessageBox
                loadingChats={loadingChats}
                isMobile={!!isMobile}
                onUserClick={handleUserClick}
              />
            </ChatContext.Provider>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);
