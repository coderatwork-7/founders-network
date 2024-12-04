import React from 'react';
import Link from 'next/link';
import {ProfileTooltip} from './profileTooltip';

export const ProfileNameTooltip: React.FC<{
  name: string;
  id: number;
  linkClassName?: string;
}> = ({name, id, linkClassName}) => {
  return (
    <ProfileTooltip profile={{id}}>
      <Link className={linkClassName} href={`/profile/${id}`}>
        {name}
      </Link>
    </ProfileTooltip>
  );
};
