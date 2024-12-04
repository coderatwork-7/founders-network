import Link from 'next/link';
import type {FunctionDataTypes} from './functionCard';
import {POST_FUNCTION_TITLE_LIMIT} from '@/utils/common/constants';
import DisplayDateTime from '@/components/Common/displayDateTime';
export default function PostFunctionTitle({
  title,
  details: {startDate, startTimeET, startTimePT},
  author: {name},
  functionId
}: FunctionDataTypes) {
  return (
    <>
      {name} {' created a new function: '}{' '}
      <Link href={`/function/${functionId}`}>
        {title.slice(0, POST_FUNCTION_TITLE_LIMIT)}
        {title.length > POST_FUNCTION_TITLE_LIMIT ? '...' : ''}
      </Link>
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
