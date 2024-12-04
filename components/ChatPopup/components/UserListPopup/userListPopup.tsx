import React, {SetStateAction, useMemo, useState} from 'react';
import classes from './userListPopup.module.scss';
import popupClasses from '@/components/ChatPopup/popupStyles.module.scss';
import clsx from 'clsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import {ConversationList} from '@/components/ChatPopup/components/ConversationList';
import {OverlayPopup} from '@/components/ChatPopup/OverlayPopup';
import {
  selectUserInfo,
  selectChatData,
  selectApiState
} from '@/store/selectors';
import {useSelector} from 'react-redux';
import {ConversationType} from '@/components/Chat';
import {UserSearch} from '@/components/Chat/UserSearch';

interface UserListPopupProps {
  expanded: boolean;
  setExpanded: React.Dispatch<SetStateAction<boolean>>;
  handleUserSelect: (conv: ConversationType) => void;
}

function convSorter(a: ConversationType, b: ConversationType): number {
  return (
    +new Date(b.lastMessageTimeStamp ?? 0) -
    +new Date(a.lastMessageTimeStamp ?? 0)
  );
}

export const UserListPopup: React.FC<UserListPopupProps> = ({
  expanded,
  setExpanded,
  handleUserSelect
}) => {
  const userInfo = useSelector(selectUserInfo());
  const [searchList, setSearchList] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingChats = useSelector(selectApiState('getChatUsers'));
  const chatUsersObj = useSelector(selectChatData());
  const chatUsers = useMemo(
    () =>
      Object.values(chatUsersObj)
        .filter((user: any) => user?.info?.userId)
        .map((user: any) => user.info)
        .sort(convSorter),
    [chatUsersObj]
  );

  const handleSelect = (conv: ConversationType) => {
    setSearchList(null);
    setIsSearching(false);
    handleUserSelect(conv);
  };

  return (
    <OverlayPopup expanded={expanded}>
      <OverlayPopup.Header
        userImg={userInfo?.avatarUrl}
        expanded={expanded}
        togglePopup={() => setExpanded(v => !v)}
        heading="Messaging"
      >
        <button
          className={clsx(
            popupClasses.popupHeaderBtn
            // isSearching && popupClasses.active
          )}
          onClick={e => {
            e.stopPropagation();
            setSearchList(null);
            setExpanded(true);
            setIsSearching(p => !expanded || !p);
          }}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>

        <button className={clsx(popupClasses.popupHeaderBtn)}>
          <FontAwesomeIcon icon={expanded ? faAngleDown : faAngleUp} />
        </button>
      </OverlayPopup.Header>

      <div
        className={clsx(
          classes.searchContainer,
          !isSearching && classes.hidden
        )}
      >
        <div className={clsx('w-100')}>
          {isSearching && (
            <UserSearch
              key={+isSearching + +expanded}
              asPopup
              setUserSearchList={setSearchList}
              setIsSearchInProgress={setLoading}
              className={clsx(classes.searchBar)}
            />
          )}
        </div>
      </div>

      <div className={popupClasses.popupBody}>
        <ConversationList
          conversations={searchList ?? chatUsers}
          loading={loading || loadingChats}
          fetchMoreUsers={() => Promise.resolve()}
          hasMoreUsers={false}
          isSearchList={isSearching}
          handleSelect={handleSelect}
        />
      </div>
    </OverlayPopup>
  );
};
