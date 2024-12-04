import React, {useCallback} from 'react';
import classes from './ourValues.module.scss';
import {Button} from '@/ds/Button';
import {ButtonVariants} from '@/ds/Button/button';

interface OurValuesProps {
  buttonClickHandler: Function;
}

export const OurValues: React.FC<OurValuesProps> = ({buttonClickHandler}) => {
  const clickHandler = useCallback(() => buttonClickHandler('values'), []);
  return (
    <div className={classes.valuesContainer}>
      <h5 className={classes.ourValuesText}>Our Values</h5>
      <h1 className={classes.valuesText}>
        Authenticity Reciprocity Humility Respect
      </h1>
      <div className={classes.separator}></div>
      <h6 className={classes.rulesText}>Ground Rules</h6>
      <p className={classes.ruleText}>No selling</p>
      <p className={classes.ruleText}>Help before you ask</p>
      <p className={classes.ruleText}>Share experience, not advise</p>
      <p className={classes.ruleText}>Embrace diversity</p>
      <Button variant={ButtonVariants.OutlinePrimary} onClick={clickHandler}>
        Show Me The Network
      </Button>
    </div>
  );
};
