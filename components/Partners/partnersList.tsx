import clsx from 'clsx';
import React, {useCallback, useState} from 'react';

import {PartnersCard} from '@/ds/CommonCards';
import {IconWrapper} from '@/ds/Icons';
import {faGrip, faList} from '@fortawesome/free-solid-svg-icons';

import classes from './partnersList.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import useChatModal from '@/hooks/useChatModal';
import {useSelector} from 'react-redux';
import {selectApiState, selectPartners} from '@/store/selectors';

export const PartnersList: React.FC<{
  ids: string[];
  onSearchPage?: boolean;
}> = ({ids, onSearchPage}) => {
  const [grid, setGrid] = useState(!!onSearchPage);
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const openChatModal = useChatModal();
  const data = useSelector(selectPartners());
  const loading = useSelector(selectApiState('getPartnersPageFeeds'));
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

  const partnerCards = (
    <>
      {ids.map(id => (
        <PartnersCard
          data={data[id]}
          key={id}
          grid={grid}
          messageClickHandler={() => handleMessage(data[id])}
        />
      ))}
    </>
  );

  if (onSearchPage) return partnerCards;

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
        {partnerCards}
      </div>
    </>
  );
};
