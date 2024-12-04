import React, {useCallback} from 'react';
import classes from './ourVision.module.scss';
import {Button} from '@/ds/Button';
import {ButtonVariants} from '@/ds/Button/button';

interface OurVisionProps {
  buttonClickHandler: Function;
}

export const OurVision: React.FC<OurVisionProps> = ({buttonClickHandler}) => {
  const clickHandler = useCallback(() => buttonClickHandler('vision'), []);
  return (
    <div className={classes.visionContainer}>
      <h6 className={classes.sharedVisionText}>Our Shared Vision</h6>
      <h1 className={classes.successText}>
        Lifelong Success Through Peer Mentorship
      </h1>
      <div className={classes.separator}></div>
      <h6 className={classes.startupText}>
        For this startup, the next, and the one after that.
      </h6>
      <Button variant={ButtonVariants.OutlinePrimary} onClick={clickHandler}>
        Our Values
      </Button>
    </div>
  );
};
