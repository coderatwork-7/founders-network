import clsx from 'clsx';
import classes from '@/ds/CommonCards/commonCards.module.scss';
import React from 'react';
import styles from './investorCardRightPanel.module.scss';
import {IntroMessageButton} from '@/ds/IntroMessageButton';
import {Button, ButtonVariants} from '@/ds/Button';
import FnText from '@/ds/FnText';

interface InvestorCardRightPanelProps {
  isMobile: boolean;
  grid: boolean;
  redirectURL: string;
  firstName: string;
  lastName: string;
  designation: string;
  companyName: string;
  background: string;
  investmentAmount?: string;
  introClickHandler: React.MouseEventHandler<HTMLAnchorElement>;
  popoverCard?: boolean;
  introRequested?: boolean;
  hasInvestorContactPermission?: boolean;
}

export const InvestorCardRightPanel: React.FC<InvestorCardRightPanelProps> = ({
  isMobile,
  grid,
  redirectURL,
  firstName,
  lastName,
  designation,
  companyName,
  background,
  investmentAmount,
  introClickHandler,
  popoverCard,
  introRequested,
  hasInvestorContactPermission = true
}) => {
  return (
    <div className={classes.rightPanel}>
      <div
        className={clsx(
          (isMobile || grid) && 'd-flex flex-column align-items-center mb-2'
        )}
      >
        {hasInvestorContactPermission ? (
          <FnText
            url={redirectURL}
            type="link"
            className={styles.investorName}
            bold
          >
            {firstName} {lastName}
          </FnText>
        ) : (
          <FnText type="heading-sm" bold>
            {firstName}
          </FnText>
        )}
        <h5 className="restrict1Line">
          {designation}, {companyName}
        </h5>
        {isMobile || grid ? (
          <div className={clsx(classes.mnHeight34)}>
            {introRequested ? (
              <Button
                variant={ButtonVariants.CardPrimary}
                subVariant="verySmall"
                disabled
                className="fw-normal"
              >
                Pending Intro
              </Button>
            ) : (
              <IntroMessageButton handleIntroClick={introClickHandler} />
            )}
          </div>
        ) : null}
      </div>
      {!grid && !popoverCard && (
        <div className={clsx(isMobile && 'd-flex flex-column gap-2')}>
          {investmentAmount && (
            <div>
              Invests:{' '}
              {investmentAmount == '$0 - $0' ? 'private' : investmentAmount}
            </div>
          )}
          {background && (
            <div className="restrict3Lines">Background: {background}</div>
          )}
        </div>
      )}
    </div>
  );
};
