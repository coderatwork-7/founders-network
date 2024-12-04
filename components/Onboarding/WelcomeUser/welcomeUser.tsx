import React, {useCallback} from 'react';
import classes from './welcomeUser.module.scss';
import {Button} from '@/ds/Button';
import {ButtonVariants} from '@/ds/Button/button';

interface WelcomeUserProps {
  name: string;
  buttonClickHandler: Function;
}

export const WelcomeUser: React.FC<WelcomeUserProps> = ({
  name,
  buttonClickHandler
}) => {
  const clickHandler = useCallback(() => buttonClickHandler('welcome'), []);
  return (
    <div className={classes.welcomeContainer}>
      <h1 className={classes.welcomeText}>
        Welcome to Founders Network,
        <br />
        {name}.
      </h1>
      <Button variant={ButtonVariants.OutlinePrimary} onClick={clickHandler}>
        Let's Get Started
      </Button>
    </div>
  );
};
