import Card from '@/ds/Card/card';
import {LEARN_MORE_URL, TESTIMONIALS_URL} from '@/utils/common/constants';
import Link from 'next/link';
import styles from './nominateInfo.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

import FnText from '@/ds/FnText';

export const NominateInfo = () => {
  return (
    <Card className={styles.cardContainer}>
      <div>
        <FnText type="heading-xSmall" bold>
          Nominating: Best Practice
        </FnText>
      </div>
      <div>
        <FnText type="heading-xxSmall" bold>
          How to Find Nominees
        </FnText>
        <FnText className={styles.content}>
          Look for fellow founders in your accelerator, alumni network,
          corporate network, co-working spaces, and networking events. Good
          candidates for Founders Network membership usually value professional
          networks.
        </FnText>
      </div>
      <div>
        <FnText type="heading-xxSmall" bold>
          Talk to your Nominees
        </FnText>
        <FnText className={styles.content}>
          Our Top Nominators ensure that their nominees understand the value of
          Founders Network by speaking to them about the benefits before
          nominating them. Reference the{' '}
          <Link href={TESTIMONIALS_URL}>Testimonials</Link> or{' '}
          <Link href={LEARN_MORE_URL}>Benefits</Link> pages if you need talking
          points.
        </FnText>
      </div>
      <div>
        <FnText type="heading-xxSmall" bold>
          How to Find Nominees
        </FnText>
        <FnText className={styles.content}>
          Look for fellow founders in your accelerator, alumni network,
          corporate network, co-working spaces, and networking events. Good
          candidates for Founders Network membership usually value professional
          networks.
        </FnText>
      </div>
    </Card>
  );
};
