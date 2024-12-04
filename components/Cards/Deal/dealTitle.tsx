import React from 'react';
import {DEALS_NO_OF_DISPLAYED_MEMBERS} from '@/utils/common/constants';
import {ProfileNameTooltip} from '@/components/ProfileTooltip';
interface DealTitleProps {
  authorName: string;
  memberNames: {
    id: number;
    name: string;
  }[];
  additionalMembersCount: number;
  dealProvider: string;
  profileId: number;
}

export default function DealTitle({
  authorName,
  memberNames,
  additionalMembersCount,
  dealProvider,
  profileId
}: DealTitleProps) {
  const realMembersCount =
    additionalMembersCount +
    (memberNames.length -
      Math.min(DEALS_NO_OF_DISPLAYED_MEMBERS, memberNames.length));
  return (
    <>
      <ProfileNameTooltip id={profileId} name={authorName} />
      {memberNames.slice(0, DEALS_NO_OF_DISPLAYED_MEMBERS).map(member => (
        <React.Fragment key={member.id}>
          {', '}
          <ProfileNameTooltip id={member.id} name={member.name} />
        </React.Fragment>
      ))}
      {realMembersCount > 0 && ` and ${realMembersCount} others`} just cut their
      burn rate with a fnDeal on {dealProvider}
      <br />
    </>
  );
}
