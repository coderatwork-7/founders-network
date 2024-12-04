import {IntroMessageButton} from '@/ds/IntroMessageButton';
import classes from '../commonCards.module.scss';

export const IntroButtonContainer: React.FC<{
  grid: boolean;
  isMobile: boolean;
  introClickHandler?: React.MouseEventHandler<HTMLAnchorElement>;
  messageClickHandler?: React.MouseEventHandler<HTMLAnchorElement>;
}> = ({grid, isMobile, introClickHandler, messageClickHandler}) => {
  if (!grid && !isMobile) {
    return (
      <div className={classes.introButton}>
        <IntroMessageButton
          isCompatible
          handleIntroClick={introClickHandler}
          handleMessageClick={messageClickHandler}
        />
      </div>
    );
  }
  return null;
};
