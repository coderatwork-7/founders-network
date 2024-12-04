import React, {MouseEventHandler, useState} from 'react';
import popupClasses from '@/components/ChatPopup/popupStyles.module.scss';
import clsx from 'clsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {MessageBox} from '@/components/Chat/MessageBox';
import {MessageInput} from '@/components/Chat/MessageInput';
import {OverlayPopup} from '@/components/ChatPopup/OverlayPopup';
import {ConversationType} from '@/components/Chat';

interface UserMessagesPopupProps {
  user: ConversationType;
  expanded: boolean;
  closePopup: () => void;
  togglePopup: () => void;
  onUserClick: (clickedUser: ConversationType) => void;
}

export const UserMessagesPopup: React.FC<UserMessagesPopupProps> = ({
  user,
  expanded,
  closePopup,
  togglePopup,
  onUserClick
}) => {
  const handleClose: MouseEventHandler = event => {
    event.stopPropagation();
    closePopup();
  };

  return (
    <OverlayPopup expanded={expanded} className={popupClasses.isMsgPopup}>
      <OverlayPopup.Header
        expanded={expanded}
        togglePopup={togglePopup}
        heading={user?.name ?? ''}
        subHeading={user?.companyName}
        userImg={user?.profileImage}
      >
        <button
          className={clsx(popupClasses.popupHeaderBtn)}
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </OverlayPopup.Header>

      <div className={popupClasses.popupBody}>
        <MessageBox
          asPopup
          popupUser={user}
          loadingChats={false}
          isMobile={false}
          onUserClick={onUserClick}
        />
      </div>
      <div className={popupClasses.popupFooter}>
        <MessageInput isMobile={false} asPopup popupUser={user} />
      </div>
    </OverlayPopup>
  );
};
