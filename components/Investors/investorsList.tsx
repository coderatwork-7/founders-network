import clsx from 'clsx';
import React, {useCallback, useState} from 'react';
import {IconWrapper} from '@/ds/Icons';
import {faGrip, faList} from '@fortawesome/free-solid-svg-icons';
import classes from './investorsList.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {useSelector} from 'react-redux';
import {selectApiState, selectInvestors} from '@/store/selectors';
import {InvestorsCard} from '@/ds/CommonCards';

export const InvestorsList: React.FC<{ids: string[]}> = ({ids}) => {
  const [grid, setGrid] = useState(false);
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const data = useSelector(selectInvestors());
  const loading = useSelector(selectApiState('getInvestorsPageFeeds'));
  const handleClick = useCallback((grid = false) => {
    return (event: React.MouseEvent<SVGSVGElement>) => {
      setGrid(grid);
    };
  }, []);

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
        {ids.map(id => (
          <InvestorsCard data={data[id]} key={id} grid={grid} />
        ))}
      </div>
    </>
  );
};
