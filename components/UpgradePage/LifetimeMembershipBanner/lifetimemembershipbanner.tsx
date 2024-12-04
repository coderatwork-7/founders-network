import Image from 'next/image';
import classes from './lifetimemembershipbanner.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLongArrowRight} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from 'next/navigation';

export const LifetimeMembershipBanner = () => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const router = useRouter();
  return (
    <div
      className={classes['lifetimeContainer']}
      onClick={() => router.replace('/raise?stage=lifetime')}
    >
      <Image
        src="https://staging.foundersnetwork.com/static/fnsite/img/svg/Lifetime_with_White_Border.svg"
        alt="lifetime membership banner"
        width={70}
        height={70}
      />
      {' Never pay membership dues again.'}
      {!isMobile && ' Switch to a Lifetime Membership '}
      {!isMobile && <FontAwesomeIcon icon={faLongArrowRight} />}
    </div>
  );
};
