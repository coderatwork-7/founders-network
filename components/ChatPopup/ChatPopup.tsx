import React, {useEffect, useRef, useState} from 'react';
import classes from './chatPopup.module.scss';
import {selectUserInfo} from '@/store/selectors';
import {useSelector} from 'react-redux';
import {UserMessagesPopup} from '@/components/ChatPopup/components/UserMessagesPopup';
import {ConversationType} from '@/components/Chat';
import {UserListPopup} from '@/components/ChatPopup/components/UserListPopup';
import {useSession} from 'next-auth/react';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import useAPI from '@/utils/common/useAPI';

const MAX_POPUP_LIMIT = 3;

export interface MessagePopup {
  user: ConversationType;
  expanded: boolean;
}

const ChatPopup: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [lastPopupIndex, setLastPopupIndex] = useState(0);
  const [activeChatsList, setActiveChatsList] = useState<number[]>([]);
  const userInfo = useSelector(selectUserInfo());
  const api = useAPI();
  const {update} = useSession();
  const [activeChats, setActiveChats] = useState<{
    [userId: number]: MessagePopup;
  }>([]);
  const [maxPopups, setMaxPopups] = useState(1);

  const userId = useSelector(selectUserInfo())?.id;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    const {width} = containerRef?.current?.getBoundingClientRect() ?? {};
    setMaxPopups(
      width ? Math.min(Math.floor((width - 280) / 370), MAX_POPUP_LIMIT) : 1
    );
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }

      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [userId]);

  useEffect(() => {
    setActiveChatsList(list => list.slice(0, maxPopups));
    setLastPopupIndex(0);
  }, [maxPopups]);

  const addChatPopup = (conv: ConversationType) => {
    setActiveChatsList(p => [...p, conv.userId]);
    setActiveChats(prev => ({
      ...prev,
      [conv.userId]: {user: conv, expanded: true}
    }));
  };

  const minimizePopups = () => {
    setActiveChats(prevChats => {
      const newChats: {[id: number]: MessagePopup} = {};

      activeChatsList.forEach(id => {
        newChats[id] = {user: prevChats[id].user, expanded: false};
      });

      return newChats;
    });
  };

  const replaceLastChatPopup = (conv: ConversationType) => {
    setActiveChatsList(p => {
      setActiveChats(({[p[lastPopupIndex]]: _oldUser, ...prev}) => ({
        ...prev,
        [conv.userId]: {user: conv, expanded: true}
      }));

      let prevList = [...p];
      prevList[lastPopupIndex] = conv.userId;
      return prevList;
    });

    setLastPopupIndex(index => (index + 1) % maxPopups);
  };

  const getViewMessages = async () => {
    try {
      await api('getViewMessages', {
        method: 'GET',
        userId: userInfo?.id ?? '',
        chatUserId: activeChatsList,
        concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
      });
      update({messageCount: 0});
    } catch (error) {
      console.error('Error calling getViewMessages API:', error);
    }
  };

  useEffect(() => {
    if (activeChatsList.length > 0) {
      getViewMessages();
    }
  }, [activeChatsList]);

  const handleUserSelect = (conv: ConversationType) => {
    minimizePopups();
    if (activeChatsList.includes(conv.userId)) {
      changePopupState(conv.userId, true)();
    } else {
      activeChatsList.length === maxPopups
        ? replaceLastChatPopup(conv)
        : addChatPopup(conv);
    }
    getViewMessages();
  };

  const changePopupState = (userId: number, expand?: boolean) => () => {
    setActiveChats(prev => ({
      ...prev,
      [userId]: {
        user: prev[userId].user,
        expanded: expand ?? !prev[userId].expanded
      }
    }));
  };

  const closePopup = (userId: number) => () => {
    setActiveChatsList(p => p.filter(id => id !== userId));
    setActiveChats(prev => {
      const prevChats = {...prev};
      delete prevChats[userId];
      return prevChats;
    });
  };
  function onUserClick(clickedUser: ConversationType): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      {!!userId && (
        <div className={classes.popupContainer} ref={containerRef}>
          <UserListPopup
            expanded={expanded}
            setExpanded={setExpanded}
            handleUserSelect={handleUserSelect}
          />

          {activeChatsList.map(userId => (
            <UserMessagesPopup
              key={userId}
              user={activeChats[userId]?.user}
              expanded={activeChats[userId]?.expanded}
              togglePopup={changePopupState(userId)}
              closePopup={closePopup(userId)}
              onUserClick={onUserClick}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ChatPopup;
