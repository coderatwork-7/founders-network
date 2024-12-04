import {selectInvestorInfo} from '@/store/selectors';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {InvestorCard} from '../InvestorCard/investorCard';
import classes from './investorList.module.scss';

export function InvestorList({ids}: {ids: any}) {
  const investorInfo = useSelector(selectInvestorInfo('opportunities'));
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === Breakpoint.mobile;
  const isTablet = breakpoint === Breakpoint.tablet;
  return (
    <div
      className={clsx(
        'd-flex justify-content-between flex-wrap',
        isTablet && 'justify-content-evenly',
        isMobile && 'justify-content-start',
        classes.flexRowGap,
        classes.marginTop20
      )}
    >
      {ids?.map((id: number) => {
        return <InvestorCard userDetails={investorInfo?.[id]} key={id} />;
      })}
    </div>
  );
}
