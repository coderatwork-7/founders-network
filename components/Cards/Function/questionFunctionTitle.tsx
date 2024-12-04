import Link from 'next/link';
import type {FunctionDataTypes} from './functionCard';
import DisplayDateTime from '@/components/Common/displayDateTime';
import {ProfileNameTooltip} from '@/components/ProfileTooltip';
export default function QuestionFunctionTitle({
  author: {name, profileId},
  title,
  details: {startDate, startTimePT, startTimeET},
  functionId
}: FunctionDataTypes) {
  return (
    <>
      <ProfileNameTooltip id={profileId} name={name} />
      {' just posted a question. '}
      <Link href={`/function/${functionId}`}>{title}</Link>
      {' on:'}
      <br />
      <DisplayDateTime
        creationDate={startDate}
        creationTimePT={startTimePT}
        creationTimeET={startTimeET}
      />
    </>
  );
}
