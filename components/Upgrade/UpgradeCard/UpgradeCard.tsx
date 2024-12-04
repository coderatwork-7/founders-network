import React from 'react';
import classes from './UpgradeCard.module.scss';
import Link from 'next/link';
import Image, {StaticImageData} from 'next/image';
import clsx from 'clsx';
import {PAYMENT_PLAN, PAYMENT_PLAN_BENEFITS} from '@/utils/common/constants';
import AngelIcon from '@/public/images/angel_badge.svg';
import SeriesAIcon from '@/public/images/seriesa_badge.svg';
import LifetimeIcon from '@/public/images/lifetime_membership.svg';
import parse from 'html-react-parser';
import {capitalize} from '@/utils/common/helper';

const UPGRADE_ICON_SIZE = 36;

interface UpgradeCardProps {
  plan: PAYMENT_PLAN;
  expanded: boolean;
}

const PAY_PLAN_MAP: {
  [key: string]: {
    link: string;
    icon: StaticImageData;
    name: string;
    benefits: string;
    className: string;
  };
} = {
  [PAYMENT_PLAN.ANGEL]: {
    link: '/raise/?stage=scale',
    icon: AngelIcon,
    name: 'Angel',
    benefits: `save <b>$${
      PAYMENT_PLAN_BENEFITS[PAYMENT_PLAN.ANGEL]
    }</b> on functions anually`,
    className: 'angel'
  },
  [PAYMENT_PLAN.SERIES_A]: {
    link: '/raise/?stage=seriesa',
    icon: SeriesAIcon,
    name: 'Series A+',
    benefits: `save <b>$${
      PAYMENT_PLAN_BENEFITS[PAYMENT_PLAN.SERIES_A]
    }</b> on functions anually`,
    className: 'seriesA'
  },
  [PAYMENT_PLAN.LIFETIME]: {
    link: '/raise/?stage=lifetime',
    icon: LifetimeIcon,
    name: 'Lifetime',
    benefits: `receive <b>$${
      PAYMENT_PLAN_BENEFITS[PAYMENT_PLAN.LIFETIME]
    }</b> in function credits`,
    className: 'lifetime'
  }
};

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  plan,
  expanded = false
}) => {
  return (
    <Link
      href={PAY_PLAN_MAP[plan].link}
      className={clsx([
        classes.upgradeCard,
        !expanded && 'flex-column gap-0 align-items-start',
        classes[PAY_PLAN_MAP[plan].className]
      ])}
    >
      {expanded ? (
        <>
          <Image
            src={PAY_PLAN_MAP[plan].icon}
            alt="Badge"
            width={UPGRADE_ICON_SIZE}
            height={UPGRADE_ICON_SIZE}
          />
          <div>
            Upgrade to {PAY_PLAN_MAP[plan].name} and&nbsp;
            {parse(PAY_PLAN_MAP[plan].benefits)}.
          </div>
        </>
      ) : (
        <>
          <div>Upgrade to {PAY_PLAN_MAP[plan].name}</div>
          <div>{parse(capitalize(PAY_PLAN_MAP[plan].benefits))}.</div>
        </>
      )}
    </Link>
  );
};
