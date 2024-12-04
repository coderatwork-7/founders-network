import clsx from 'clsx';
import styles from './card.module.scss';
import {
  TYPE_DEALS,
  TYPE_FUNCTIONS,
  TYPE_FORUMS,
  TYPE_MEMBERS,
  TYPE_GROUPS
} from '@/utils/common/commonTypes';

interface CardPropTypes {
  feedsType?:
    | TYPE_DEALS
    | TYPE_FUNCTIONS
    | TYPE_FORUMS
    | TYPE_MEMBERS
    | TYPE_GROUPS;
  children: any;
  className?: string;
  bannerImageUrl?: string;
  containerClassName?: string;
}

export default function Card({
  bannerImageUrl,
  feedsType,
  children,
  className,
  containerClassName
}: CardPropTypes): JSX.Element {
  const contentClassname = clsx(styles.cardContent, className);
  return (
    <div
      className={clsx(
        styles.container,
        feedsType && styles.feedsStyles,
        feedsType && styles[feedsType + 'ContainerStyles'],
        'container-border',
        'container-box-shadow',
        containerClassName
      )}
    >
      {bannerImageUrl && <img src={bannerImageUrl} className={styles.banner} />}
      <div className={contentClassname}>{children}</div>
    </div>
  );
}
