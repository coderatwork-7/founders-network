import clsx from 'clsx';
import {DealsPageCard} from './DealsPageCard/dealsPageCard';
import {selectDeals} from '@/store/selectors';
import {useSelector} from 'react-redux';
import classes from './dealsList.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {convertObjectUsingReverseMapping} from '@/utils/common/helper';
import {DEALS_PAGE_MAP} from '@/utils/common/apiToStoreMaps';
import {OnboardingTooltip} from '../Onboarding/OnboardingTooltip';
import {TPlan} from '@/utils/data/plans';
import {IDeal} from '@/utils/interfaces/deal';
interface DealsListProps {
  data: IDeal[];
  selectedTab: string;
}

export interface DealsPageResponse {
  id: number;
  name: string;
  url: string;
  title: string;
  imgSrc: string;
  rating: number;
  description: string;
  tags: {
    id: number;
    name: string;
  }[];
  recommendations: string;
  isFeatured: boolean;
  isRedeemed: boolean;
  upgradeNeeded: boolean;
  value: string;
  isRatedByUser: boolean;
}

export const DealsList: React.FC<DealsListProps> = ({data, selectedTab}) => {
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
      <div className={classes.onboarding}>
        <OnboardingTooltip type="deals" position="left" />
      </div>
      {data
        ?.filter(item => item.isFeatured)
        ?.map(item => (
          <DealsPageCard
            deal={item}
            key={item.id}
            isMobile={isMobile}
            selectedTab={selectedTab}
            plan={selectedTab}
          />
        ))}
      {data
        ?.filter(item => !item.isFeatured)
        ?.map(item => (
          <DealsPageCard
            deal={item}
            key={item.id}
            isMobile={isMobile}
            selectedTab={selectedTab}
            plan={selectedTab}
          />
        ))}
      {!data?.length && (
        <div className="text-center w-100 mt-4">No Deals Found!</div>
      )}
    </div>
  );
};
