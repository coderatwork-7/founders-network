import React, {MouseEventHandler} from 'react';
import classes from './content.module.scss';
import parser from 'html-react-parser';
import {RightAngleIcon, CloseIcon} from '@/ds/Icons';

interface ContentProps {
  header?: string;
  content?: string;
  type?: string;
  closeClickHandler?: MouseEventHandler<HTMLDivElement>;
  nextClickHandler?: MouseEventHandler<HTMLDivElement>;
  doneClickHandler?: MouseEventHandler<HTMLDivElement>;
}

export const Content: React.FC<ContentProps> = ({
  header,
  content = '',
  type = '',
  closeClickHandler,
  nextClickHandler,
  doneClickHandler
}) => {
  return (
    <div className={classes.content}>
      <div>
        <h6 className={classes.header}>{header}</h6>
        <div className={classes.cross} onClick={closeClickHandler}>
          <CloseIcon />
        </div>
      </div>
      <span className={classes.text}>{parser(content)}</span>
      {nextClickHandler && (
        <div className={classes.icon} onClick={nextClickHandler}>
          <span>Next </span>
          <RightAngleIcon />
        </div>
      )}
      {doneClickHandler && type === 'rewards' && (
        <div className={classes.icon} onClick={doneClickHandler}>
          <span>Done </span>
        </div>
      )}
    </div>
  );
};
