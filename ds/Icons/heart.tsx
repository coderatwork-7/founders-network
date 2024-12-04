import classes from './icons.module.scss';
import HeartFilledSvg from '@/public/svgIcons/heart_inactive_full.svg';
import Image from 'next/image';
import HeartEmptySvg from '@/public/svgIcons/Heart_Inactive.svg';
import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {Popover} from '@/ds/Popover';
import Link from 'next/link';
import clsx from 'clsx';

const defaultUserListRenderer = (likedBy: HeartIconPropsType['likedBy']) =>
  likedBy?.map(({id, name}) => (
    <div key={id}>
      <Link href="#">{name}</Link>
    </div>
  ));
export interface HeartIconPropsType {
  count?: number;
  isLiked?: boolean;
  likedBy?: {id: number; name: string}[];
  makeLikeRequest?: Function;
  size?: 'sm' | 'lg';
  loading: boolean;
  renderUserList?: typeof defaultUserListRenderer;
}

export const HeartIcon: React.FC<HeartIconPropsType> = ({
  count,
  isLiked,
  likedBy,
  makeLikeRequest,
  size = 'sm',
  loading,
  renderUserList = defaultUserListRenderer
}: HeartIconPropsType) => {
  const [isFilled, setIsFilled] = useState(isLiked);
  useEffect(() => setIsFilled(isLiked), [isLiked]);
  const setHeartFilled = useCallback(
    () => !isLiked && setIsFilled(true),
    [isLiked]
  );
  const setHeartEmpty = useCallback(
    () => !isLiked && setIsFilled(false),
    [isLiked]
  );
  const iconProps = useMemo(
    () => ({
      alt: `heart icon: ${isFilled ? 'liked' : 'unliked'}`,
      onMouseOver: setHeartFilled,
      onMouseOut: setHeartEmpty
    }),
    [isFilled, isLiked]
  );

  return (
    <Popover
      popover={
        !!likedBy?.length && (
          <div className={classes.popover}>{renderUserList(likedBy)}</div>
        )
      }
      placement="right"
      mode="hover"
      popoverClass="rounded"
    >
      <span
        className={clsx(classes.container, loading && classes.cursorDefault)}
        onClick={loading ? undefined : (makeLikeRequest as () => void)}
      >
        <Image
          src={HeartFilledSvg}
          {...iconProps}
          className={clsx(
            classes.icon,
            loading && classes.cursorDefault,
            !isFilled && 'd-none',
            size === 'lg' && classes.iconLarge
          )}
        />
        <Image
          src={HeartEmptySvg}
          {...iconProps}
          className={clsx(
            classes.icon,
            loading && classes.cursorDefault,
            isFilled && 'd-none',
            size === 'lg' && classes.iconLarge
          )}
        />

        {count !== undefined && (
          <span className={classes.count}>{Math.max(count, 0)}</span>
        )}
      </span>
    </Popover>
  );
};
