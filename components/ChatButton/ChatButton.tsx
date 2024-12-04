import React from 'react';
import classes from './ChatButton.module.scss';
import {Badge} from '@/ds/Badge';
import {MessageIcon} from '@/ds/Icons';
import {useSelector} from 'react-redux';
import {selectChatData, selectUserInfo} from '@/store/selectors';
import useChatModal from '@/hooks/useChatModal';

export const ChatButton: React.FC = () => {
  const openChatModal = useChatModal();

  const userInfo = useSelector(selectUserInfo());
  const {info: {data: {unreadConvCount = undefined} = {}} = {}} = useSelector(
    selectChatData()
  );

  return (
    <>
      <Badge
        icon={<MessageIcon className={classes.icon} />}
        count={unreadConvCount ?? userInfo?.messageCount}
        onClick={() => openChatModal()}
      />
    </>
  );
};
