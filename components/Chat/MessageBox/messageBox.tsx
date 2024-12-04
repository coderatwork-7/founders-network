import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import defaultClasses from './messageBox.module.scss';
import popupClasses from './messageBoxPopup.module.scss';
import {Conversation} from '../Conversation';
import {MessageList} from '../MessageList';
import {MessageInput} from '../MessageInput';
import {ChatContext} from '../ChatContext';
import clsx from 'clsx';
import {IconWrapper} from '@/ds/Icons';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import useAPI from '@/utils/common/useAPI';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserMsgs, selectUserInfo} from '@/store/selectors';
import InfiniteScroll from 'react-infinite-scroller';
import {ProgressBar} from 'react-bootstrap';
import {setChatLoading} from '@/store/reducers/chatReducer';
import {ConversationType} from '..';

export const MessageBox = ({
  loadingChats,
  isMobile,
  asPopup,
  popupUser,
  onUserClick
}: {
  loadingChats: boolean;
  isMobile: boolean;
  asPopup?: boolean;
  popupUser?: any;
  onUserClick: (clickedUser: ConversationType) => void;
}) => {
  const classes = asPopup ? popupClasses : defaultClasses;
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  let {
    activeConv,
    setActiveConv = undefined,
    handleCloseModal = undefined
  } = useContext(ChatContext);
  if (asPopup) activeConv = popupUser;
  const dispatch = useDispatch();
  const {messages: {data: messages = undefined} = {}, info: chatInfo} =
    useSelector(selectUserMsgs(activeConv?.userId)) ?? {};

  const {
    hasMore = false,
    pageNum = 1,
    isLoading: loading = false
  } = chatInfo ?? {};

  const scrollOptions = useRef({distance: 0, newMsg: true});
  const msgBoxRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(false);

  const getMessages = async () => {
    if (activeConv?.userId) {
      dispatch(setChatLoading({userId: activeConv?.userId}));
      await api('getUserMessages', {
        userId: userInfo?.id ?? '',
        chatUserId: activeConv?.userId || '',
        page: pageNum
      }).catch(e => {
        dispatch(setChatLoading({userId: activeConv?.userId, loading: false}));
      });
    }
  };

  const loadMoreMsgs = () => {
    if (pageNum === 1) return;
    getMessages();
    scrollOptions.current.newMsg = false;
    scrollOptions.current.distance = msgBoxRef.current?.scrollHeight ?? 0;
  };

  useEffect(() => {
    if (initialLoad) setInitialLoad(false);
    if (activeConv?.userId && !messages && !loading && !loadingChats) {
      getMessages().then(() => {
        if (!initialLoad) setInitialLoad(true);
      });
    }
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    }
  }, [activeConv, loadingChats]);

  useLayoutEffect(() => {
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop =
        msgBoxRef.current.scrollHeight -
        (scrollOptions.current.newMsg ? 0 : scrollOptions.current.distance);
    }
    scrollOptions.current.newMsg = true;
  }, [messages]);

  return (
    <div
      className={clsx([classes.chatContainer, !!activeConv && classes.show])}
    >
      {!asPopup && (
        <div className={classes.chatHeader}>
          <span
            role="button"
            onClick={() => setActiveConv(null)}
            className={classes.iconBack}
          >
            <IconWrapper icon={faChevronLeft} className="fs-4" />
          </span>
          {activeConv && (
            <Conversation
              conversation={activeConv}
              asHeader
              handleClose={handleCloseModal}
              onUserClick={onUserClick}
            />
          )}
        </div>
      )}
      <div
        className={clsx([
          classes.messageListContainer,
          asPopup ? 'chatPopupScrollBar' : 'container-border'
        ])}
        ref={msgBoxRef}
        onScroll={() =>
          (scrollOptions.current.distance = msgBoxRef.current
            ? msgBoxRef.current.scrollHeight - msgBoxRef.current.scrollTop
            : 0)
        }
      >
        <InfiniteScroll
          pageStart={1}
          loadMore={loadMoreMsgs}
          hasMore={hasMore}
          threshold={1}
          isReverse
          initialLoad={initialLoad}
          loader={
            loading ? (
              <div key={activeConv?.userId} className={classes.progressBar}>
                <ProgressBar animated now={100} variant="success" />
              </div>
            ) : (
              <></>
            )
          }
          useWindow={false}
        >
          <MessageList
            asPopup={asPopup}
            msgs={(activeConv && messages) ?? []}
            loading={(loading && pageNum === 1) || loadingChats}
          />
        </InfiniteScroll>
      </div>

      {!!activeConv && !asPopup && <MessageInput isMobile={isMobile} />}
    </div>
  );
};
