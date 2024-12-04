import React from 'react';
import Image from 'next/image';
import classes from './avatar.module.scss';
import {
  BADGE_HEIGHT,
  BADGE_WIDTH,
  LAUNCH,
  LEAD,
  LIFETIME,
  PAYMENT_PLAN,
  SCALE
} from '@/utils/common/constants';
import {
  TYPE_ANGEL,
  TYPE_SERIESAPLUS,
  TYPE_LIFETIME
} from '@/utils/common/commonTypes';
import clsx from 'clsx';
import Link from 'next/link';
import {checkURL} from '@/utils/common/helper';

interface AvatarProps {
  avatarUrl?: string;
  altText: string;
  badge?: string;
  size?: 'sm' | 'md' | 'lg' | 'xx-lg';
  newDesign?: boolean;
  imageHeight?: number;
  imageWidth?: number;
  profileURL?: string;
  imgContainerStyles?: string;
  badgeWidth?: number;
  badgeHeight?: number;
}
export type BadgeTypes = typeof SCALE | typeof LIFETIME | typeof LEAD;
export const badgeMapping = {
  [SCALE]: {path: 'angel_badge.svg', alt: 'Angel badge'},
  [LEAD]: {path: 'seriesa_badge.svg', alt: 'Series A Plus badge'},
  [LIFETIME]: {path: 'lifetime_membership.svg', alt: 'Lifetime badge'}
};

/**
 * Avatar Component.
 * Contains newDesign. Configure imageHeight & imageWidth for variable sizes.
 * @param {avatarUrl: string, altText: string, badge: string, size: string, newDesign: boolean, imageHeight: number, imageWidth: number}
 * @returns React Functional Component
 */
export default function Avatar({
  avatarUrl,
  altText,
  badge,
  size = 'md',
  newDesign,
  imageHeight = 58,
  imageWidth = 58,
  profileURL,
  badgeHeight,
  badgeWidth,
  imgContainerStyles
}: AvatarProps) {
  const containerClassName = newDesign
    ? classes.newImageContainer
    : clsx(imgContainerStyles ?? '', classes.imageContainer, classes[size]);

  const {path, alt} =
    (badge && badge !== LAUNCH && badgeMapping[badge as BadgeTypes]) || {};

  return (
    <div className={classes.container}>
      {badge && path && (
        <span className={clsx(newDesign ? classes.newBadge : classes.badge)}>
          <Image
            src={`/images/${path}`}
            alt={alt ?? ''}
            width={badgeWidth ?? BADGE_WIDTH}
            height={badgeHeight ?? BADGE_HEIGHT}
            style={{objectFit: 'cover'}}
          />
        </span>
      )}
      <div className={containerClassName}>
        {profileURL ? (
          <Link href={profileURL || '#'}>
            <Image
              height={imageHeight}
              width={imageWidth}
              alt={altText}
              src={checkURL(avatarUrl)}
              className={clsx(newDesign && classes.newImage)}
            />
          </Link>
        ) : (
          <Image
            height={imageHeight}
            width={imageWidth}
            alt={altText}
            src={avatarUrl ?? ''}
            className={clsx(newDesign && classes.newImage)}
          />
        )}
      </div>
    </div>
  );
}
