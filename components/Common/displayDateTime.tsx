import React from 'react';
import {parseISO, format, parse} from 'date-fns';
interface DisplayDateTimeProps {
  creationDate: string;
  creationTimePT?: string;
  creationTimeET?: string;
}
export default function DisplayDateTime({
  creationDate,
  creationTimePT,
  creationTimeET
}: DisplayDateTimeProps) {
  return (
    <span className="cardTitleText">
      {!creationTimePT
        ? format(parseISO(creationDate), 'MMMM d, yyyy, hh:mm a')
        : format(parseISO(creationDate), 'MMMM d, yyyy')}
      {creationTimePT && (
        <>
          ,{' '}
          {format(
            parse(creationTimePT.slice(0, -4), 'HH:mm:ss', new Date()),
            'hh:mm a'
          )}
          {' PT ('}
          {format(
            parse((creationTimeET ?? '').slice(0, -4), 'HH:mm:ss', new Date()),
            'hh:mm a'
          )}
          {' ET)'}
        </>
      )}
    </span>
  );
}
