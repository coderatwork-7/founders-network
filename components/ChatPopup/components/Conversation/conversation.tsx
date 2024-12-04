import React from 'react';
import classes from './conversation.module.scss';
import clsx from 'clsx';
import {
  formatChatDateTime,
  htmlToText,
  limitString
} from '@/utils/common/helper';
import {ConversationType} from '@/components/Chat';

interface ConversationProps {
  conversation: ConversationType;
  handleSelect: (conv: ConversationType) => void;
  isSearch?: boolean;
}

export const Conversation: React.FC<ConversationProps> = ({
  conversation,
  handleSelect,
  isSearch
}) => {
  const {
    profileImage,
    name,
    messageSample,
    lastMessageTimeStamp,
    unreadCount,
    companyName
  } = conversation;

  return (
    <div
      className={clsx([classes.conversation])}
      onClick={() => handleSelect(conversation)}
    >
      <div className={classes.senderImageContainer}>
        <img className={classes.senderImage} src={profileImage ?? ''} alt="" />
      </div>

      <div className={classes.contentConatiner}>
        <div className={classes.content}>
          <div className={classes.heading}>
            <span
              className={clsx([
                classes.name,
                isSearch && classes.isSearch,
                'text-truncate'
              ])}
            >
              {name}
            </span>
            {lastMessageTimeStamp && !isSearch && (
              <span className={classes.time}>
                {formatChatDateTime(lastMessageTimeStamp)}
              </span>
            )}
          </div>

          <div
            className={clsx(classes.lastMessage, isSearch && classes.isSearch)}
          >
            {isSearch
              ? companyName
              : limitString(htmlToText(messageSample), 50)}
          </div>

          {!isSearch && (unreadCount ?? 0) > 0 && (
            <div className={classes.unreadCount}>{unreadCount}</div>
          )}
        </div>
      </div>
    </div>
  );
};
