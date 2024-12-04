import React from 'react';
import type {RsvpFunctionCard} from './functionCard';
import DisplayDateTime from '@/components/Common/displayDateTime';
import {FUNCTION_RSVP_TITLE_NAMES_LIMIT} from '@/utils/common/constants';
import {ProfileNameTooltip} from '@/components/ProfileTooltip';

const getAttendiesElement = (
  author: RsvpFunctionCard['author'],
  attendies: RsvpFunctionCard['attendies'],
  extraAttendiesCount: RsvpFunctionCard['extraAttendiesCount']
) => {
  const membersCount = attendies.length;
  if (attendies.length === 0 && extraAttendiesCount === 0) {
    return (
      <>
        <ProfileNameTooltip id={author.profileId} name={author.name} />
        {` is RSVP'd for: `}
      </>
    );
  }

  const remainingMembers =
    extraAttendiesCount +
    (attendies.length -
      Math.min(FUNCTION_RSVP_TITLE_NAMES_LIMIT, attendies.length));
  return (
    <>
      <ProfileNameTooltip id={author.profileId} name={author.name} />
      {attendies
        .slice(0, FUNCTION_RSVP_TITLE_NAMES_LIMIT)
        .map((member, index) => (
          <React.Fragment key={member.profileId}>
            {remainingMembers === 0 && index === membersCount - 1
              ? ' and '
              : ', '}
            <ProfileNameTooltip id={member.profileId} name={member.name} />
          </React.Fragment>
        ))}
      {remainingMembers > 0 &&
        ` and ${remainingMembers} other${remainingMembers === 1 ? '' : 's'} `}
      {` are RSVP'd for: `}
    </>
  );
};

export default function RsvpFunctionTitle({
  attendies,
  extraAttendiesCount,
  details: {startDate, startTimeET, startTimePT},
  author
}: RsvpFunctionCard) {
  return (
    <>
      {getAttendiesElement(author, attendies, extraAttendiesCount)}
      <br />
      <DisplayDateTime
        creationDate={startDate}
        creationTimePT={startTimePT}
        creationTimeET={startTimeET}
      />
    </>
  );
}
