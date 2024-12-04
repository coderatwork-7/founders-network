import React from 'react';
import Card from '@/ds/Card/card';
import classes from './guidelineContent.module.scss';
import parse from 'html-react-parser';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import clsx from 'clsx';

export const GuidelinesContent: React.FC<{
  header1?: string;
  header2?: string;
  content?: string;
  contentId?: string;
}> = ({header1, header2, content, contentId}) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <div
      className={clsx(
        classes.guidelineContent,
        isMobile && classes.mobileContent
      )}
      id={contentId ?? ''}
    >
      {header1 && <h1>{header1}</h1>}
      {header2 && <h2>{header2}</h2>}
      {content && (
        <Card>
          <div className={classes.content}>{parse(content ?? '')}</div>
        </Card>
      )}
    </div>
  );
};
