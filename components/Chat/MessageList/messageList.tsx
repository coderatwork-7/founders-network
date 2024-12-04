import React from 'react';
import classes from './messageList.module.scss';
import {MessageType} from '../chatModal';
import {Message} from '../Message/message';
import {Spinner} from '@/ds/Spinner';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

interface MessageListProps {
  msgs: Array<MessageType> | null;
  loading: boolean;
  asPopup?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  msgs,
  loading,
  asPopup = false
}) => {
  const userInfo = useSelector(selectUserInfo());
  const userId = userInfo?.id ?? '';

  return (
    <div className={classes.messageList}>
      {loading ? (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      ) : (
        <>
          {msgs?.map(msg => {
            return (
              <Message
                asPopup={asPopup}
                key={msg.messageId}
                msg={msg}
                isSent={userId.toString() == msg.sender}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
