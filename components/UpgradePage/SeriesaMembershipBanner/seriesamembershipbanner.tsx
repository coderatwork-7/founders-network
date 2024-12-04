import Image from 'next/image';
import SeriesASvgIcon from '@/public/svgIcons/diamont_icon.svg';
import {Button, ButtonVariants} from '@/ds/Button';
import classes from './seriesamembershipbanner.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import clsx from 'clsx';
import {useRouter} from 'next/navigation';

export const SeriesaMembershipBanner = () => {
  const router = useRouter();
  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <div>
      <div className="d-flex justify-content-center align-items-center">
        <h3
          className={clsx(
            'fw-bold',
            isMobile && 'd-flex flex-column align-items-center lh-lg'
          )}
        >
          <Image
            className="mx-2"
            src={SeriesASvgIcon}
            alt="Series-A+"
            width={67}
            height={55}
          />
          Need More? Check Out Series A+ Level
        </h3>
      </div>
      <div>
        <Button
          className={clsx(
            classes['buttonContainer'],
            isMobile && classes['buttonMobileContainer']
          )}
          variant={ButtonVariants.CardPrimary}
          textUppercase
          onClick={() => {
            router.replace('/raise?stage=seriesa');
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
          }}
        >
          View Series A+
        </Button>
      </div>
    </div>
  );
};
