import classes from './schedulecall.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import QuestionsIconSvg from '@/public/svgIcons/phone_icon.svg';
import Image from 'next/image';
import {UpgradeCard} from '../UpgradeCard';
import {TestimonialCard} from '../TestimonialCard';
import Link from 'next/link';
import {MEMBERSHIP_PLAN_MEETING_URL} from '@/utils/common/constants';

interface TestimonailObject {
  header: string;
  badge: string;
  avatarUrl: string;
  authorName: string;
  authorDetails: string;
  quote: string;
}

interface ScheduleCallPropType {
  testimonials: TestimonailObject;
}

export const ScheduleCall = ({testimonials}: ScheduleCallPropType) => {
  return (
    <>
      <UpgradeCard defaultBorder>
        <h2 className={classes['contentTitle']}>{testimonials?.header}</h2>
        <TestimonialCard
          authorName={testimonials?.authorName}
          avatarUrl={testimonials?.avatarUrl}
          authorDetails={testimonials?.authorDetails}
          badge={testimonials?.badge}
          quote={testimonials?.quote}
        />
        <UpgradeCard defaultBorder className={classes['scheduleMeetContainer']}>
          <Image
            className={classes['callIconContainer']}
            src={QuestionsIconSvg}
            alt="Phone Call"
          />
          <div className={classes['callHeader']}>
            <h4>Schedule a call to learn more about upgrading.</h4>
          </div>
          <Link href={MEMBERSHIP_PLAN_MEETING_URL} target="_blank">
            <Button
              className={classes['scheduleCallButton']}
              variant={ButtonVariants.CardPrimary}
            >
              SCHEDULE CALL
            </Button>
          </Link>
        </UpgradeCard>
      </UpgradeCard>
    </>
  );
};
