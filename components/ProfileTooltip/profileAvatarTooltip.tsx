import React from 'react';
import {ProfileTooltip} from './profileTooltip';
import Avatar from '@/ds/Avatar/avatar';
import clsx from 'clsx';

export const ProfileAvatarTooltip: React.FC<{
  name: string;
  id: number;
  avatarUrl: string;
  badge?: string;
  newDesign?: boolean;
  imageHeight?: number;
  imageWidth?: number;
  badgeHeight?: number;
  badgeWidth?: number;
  center?: boolean;
}> = ({
  name,
  id,
  avatarUrl,
  badge,
  newDesign = true,
  imageHeight,
  imageWidth,
  badgeWidth,
  badgeHeight,
  center
}) => {
  return (
    <ProfileTooltip profile={{id}}>
      <div className={clsx(center && 'd-flex align-items-center')}>
        <Avatar
          newDesign={newDesign}
          altText={name}
          avatarUrl={avatarUrl}
          badge={badge}
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          badgeHeight={badgeHeight}
          badgeWidth={badgeWidth}
        />
      </div>
    </ProfileTooltip>
  );
};
