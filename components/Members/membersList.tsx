import clsx from 'clsx';
import React, {useCallback, useState} from 'react';

import {MembersCard} from '@/ds/CommonCards';
import {IconWrapper} from '@/ds/Icons';
import {faGrip, faList} from '@fortawesome/free-solid-svg-icons';

import classes from './membersList.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import useChatModal from '@/hooks/useChatModal';
import {useSelector} from 'react-redux';
import {selectApiState, selectMembersPosts} from '@/store/selectors';
import {CONTEXT_MAP} from '@/ds/CommonCards/components/commonCardFooter';

export const MembersList: React.FC<{
  ids: string[];
  onSearchPage?: boolean;
  cardType?: keyof typeof CONTEXT_MAP;
}> = ({ids, onSearchPage, cardType}) => {
  const [grid, setGrid] = useState(!!onSearchPage);
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const openChatModal = useChatModal();
  const data = useSelector(selectMembersPosts());

  const loading = useSelector(selectApiState('getMembersPageFeeds'));
  const handleClick = useCallback((grid = false) => {
    return (event: React.MouseEvent<SVGSVGElement>) => {
      setGrid(grid);
    };
  }, []);

  const handleMessage = (user: any) => {
    openChatModal({
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      profileImage: user.avatarUrl,
      companyName: user.companyName
    });
  };

  const memberCards = (
    <>
      {ids.map(id => (
        <MembersCard
          data={data[id]}
          key={id}
          grid={grid}
          messageClickHandler={() => handleMessage(data[id])}
          cardType={cardType}
        />
      ))}
    </>
  );

  if (onSearchPage) return memberCards;

  return (
    <>
      <div
        className={clsx(
          'd-flex justify-content-end gap-3',
          (loading == undefined || loading) && 'invisible',
          classes.header
        )}
      >
        <IconWrapper
          icon={faList}
          onClick={handleClick(false)}
          className={clsx(grid ? classes.unSelectedIcon : classes.selectedIcon)}
        />
        <IconWrapper
          icon={faGrip}
          onClick={handleClick(true)}
          className={clsx(grid ? classes.selectedIcon : classes.unSelectedIcon)}
        />
      </div>
      <div
        className={clsx('row w-100 m-auto', {
          'gy-3 gx-2': grid,
          'text-start gy-3 gx-0': !grid,
          'row-cols-2': grid && isMobile,
          'row-cols-3': grid && !isMobile,
          'row-cols-0': !grid
        })}
      >
        {memberCards}
      </div>
    </>
  );
};
