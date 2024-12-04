import useIsMobile from '@/utils/common/useIsMobile';
import React, {useMemo} from 'react';
import ChatPopup from './ChatPopup';
import {useSelector} from 'react-redux';
import {selectChatData} from '@/store/selectors';

const ChatPopupController: React.FC = () => {
  const isMobile = useIsMobile();
  const chatObj = useSelector(selectChatData());
  const chatUsers = useMemo(
    () => Object.values(chatObj).filter((user: any) => user?.info?.userId),
    [chatObj]
  );

  return isMobile || !chatUsers?.length ? <></> : <ChatPopup />;
};

export default ChatPopupController;
