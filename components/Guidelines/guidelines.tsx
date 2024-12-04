import React from 'react';
import {GuidelinesContent} from './guidelineContent';
import {GUIDELINE_DATA} from './data';

export const Guidelines = (): JSX.Element => {
  return (
    <div>
      {GUIDELINE_DATA.map(data => {
        return (
          <GuidelinesContent
            key={data.header1}
            header1={data.header1 ?? ''}
            header2={data.header2 ?? ''}
            content={data.content ?? ''}
          ></GuidelinesContent>
        );
      })}
    </div>
  );
};
