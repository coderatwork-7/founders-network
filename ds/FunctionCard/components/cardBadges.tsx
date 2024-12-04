import Image from 'next/image';
import Link from 'next/link';

import SeriesIcon from '@/public/svgIcons/plan_icon.svg';
import AngelIcon from '@/public/svgIcons/angel_icon.svg';
import LifetimeIcon from '@/public/svgIcons/Lifetime_no_border.svg';

export const BADGE_IMAGE: {
  [key: string]: any;
  Angel: any;
  'Series-A+': any;
  Lifetime: any;
} = {
  Angel: AngelIcon,
  'Series-A+': SeriesIcon,
  Lifetime: LifetimeIcon
};

export const CardBadges: React.FC<{
  badgeName: keyof typeof BADGE_IMAGE;
  hrefLink: string;
}> = ({badgeName, hrefLink}) => {
  return (
    <Link href={hrefLink}>
      <Image
        src={BADGE_IMAGE[badgeName]}
        alt={`${badgeName} level`}
        width={60}
        height={60}
      />
    </Link>
  );
};
