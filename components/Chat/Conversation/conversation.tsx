import React from 'react';
import classes from './conversation.module.scss';
import {ConversationType} from '@/components/Chat';
import clsx from 'clsx';
import Link from 'next/link';
import {formatChatDateTime} from '@/utils/common/helper';

interface ConversationProps {
  conversation: ConversationType;
  selected?: boolean;
  asHeader?: boolean;
  handleSelect?: (conv: ConversationType) => void;
  handleClose?: () => void;
  onUserClick: (clickedUser: ConversationType) => void;
}

function htmlToText(html: string = '') {
  const filterTags = html.replace(/<[^>]+>/g, '');
  const tempElement = document.createElement('div');
  tempElement.innerHTML = filterTags;
  return tempElement.innerText;
}

export const Conversation: React.FC<ConversationProps> = ({
  conversation,
  selected = false,
  asHeader = false,
  handleSelect = () => {},
  handleClose,
  onUserClick
}) => {
  const {
    profileImage,
    name,
    messageSample,
    lastMessageTimeStamp,
    unreadCount,
    companyName
  } = conversation;

  const handleClick = () => {
    // Call the onUserClick function when the conversation item is clicked
    onUserClick(conversation);
  };

  return (
    <div
      className={clsx([
        classes.conversation,
        selected && classes.selected,
        asHeader && classes.header
      ])}
      onClick={() => handleSelect(conversation)}
    >
      <div className={classes.senderImageContainer}>
        <img className={classes.senderImage} src={profileImage ?? ''} alt="" />
      </div>
      <div className={classes.contentConatiner}>
        <div className={classes.content} onClick={handleClick}>
          <div className={classes.heading}>
            {asHeader && conversation.profileUrl ? (
              <Link
                href={conversation.profileUrl ?? ''}
                onClick={() => handleClose?.()}
              >
                <span className={clsx([classes.name, 'text-truncate'])}>
                  {name}
                </span>
              </Link>
            ) : (
              <span className={clsx([classes.name, 'text-truncate'])}>
                {name}
              </span>
            )}
            {!asHeader && lastMessageTimeStamp && (
              <span className={classes.time}>
                {formatChatDateTime(lastMessageTimeStamp)}
              </span>
            )}
          </div>
          <span className={clsx([classes.company, 'text-truncate'])}>
            {companyName}
          </span>
          {!asHeader && (
            <>
              <div className={clsx([classes.lastMessage, 'text-truncate'])}>
                {htmlToText(messageSample)}
              </div>
              {(unreadCount ?? 0) > 0 && (
                <div className={classes.unreadCount}>{unreadCount}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
