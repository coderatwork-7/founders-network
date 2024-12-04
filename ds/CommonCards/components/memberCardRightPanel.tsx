import clsx from 'clsx';
import classes from '@/ds/CommonCards/commonCards.module.scss';
import React, {useContext} from 'react';
import Link from 'next/link';
import {IntroMessageButton} from '@/ds/IntroMessageButton';
import {mapFilterNames} from '../utils';
import {Button, ButtonVariants} from '@/ds/Button';
import {MembersPageFacetsContext} from '@/components/ContextProviders/MembersFacetsContext';

interface MemberCardRightPanelProps {
  isMobile: boolean;
  grid: boolean;
  redirectURL: string;
  firstName: string;
  lastName: string;
  designation: string;
  companyName: string;
  expertise: {
    name: string;
    id: string;
  }[];
  objectives?: {
    [key: string]: string;
    first: string;
    second: string;
    third: string;
  };
  priorities: string;
  introClickHandler: React.MouseEventHandler<HTMLAnchorElement>;
  messageClickHandler: React.MouseEventHandler<HTMLAnchorElement>;
  popoverCard?: boolean;
  messageSent?: boolean;
  introRequested?: boolean;
}

export const MemberCardRightPanel: React.FC<MemberCardRightPanelProps> = ({
  isMobile,
  grid,
  redirectURL,
  firstName,
  lastName,
  designation,
  companyName,
  expertise,
  objectives,
  priorities,
  introClickHandler,
  messageClickHandler,
  popoverCard,
  introRequested,
  messageSent
}) => {
  const {setSelectedFacetValues, setApplyFacets} = useContext(
    MembersPageFacetsContext
  );
  const expertiseNames = mapFilterNames(
    expertise || [],
    'expertise',
    popoverCard,
    setSelectedFacetValues,
    setApplyFacets
  );
  const objectivesData = objectives
    ? Object.keys(objectives).map((key: string) => {
        return objectives[key] ? (
          <div key={`objective_${key}`}>
            {key.charAt(0).toUpperCase() + key.slice(1)} Objective:{' '}
            <span className={classes.objectives}>{objectives[key]}</span>
          </div>
        ) : null;
      })
    : null;

  return (
    <div className={classes.rightPanel}>
      <div
        className={clsx(
          (isMobile || grid) && 'd-flex flex-column align-items-center mb-2'
        )}
      >
        <h4>
          <Link href={redirectURL} className={classes.name}>
            {firstName} {lastName}
          </Link>
        </h4>
        <h5 className="restrict1Line">
          {designation}, {companyName}
        </h5>
        {isMobile || grid ? (
          <div className={clsx(classes.mnHeight34)}>
            {/* {!introRequested && !messageSent && ( */}
            {!introRequested && (
              <IntroMessageButton
                isCompatible
                handleIntroClick={introClickHandler}
                handleMessageClick={messageClickHandler}
              />
            )}
            {introRequested && (
              <Button
                variant={ButtonVariants.CardPrimary}
                subVariant="verySmall"
                disabled
                className="fw-normal"
              >
                Pending Intro
              </Button>
            )}
            {/* {!introRequested && messageSent && (
              <Button
                variant={ButtonVariants.CardPrimary}
                subVariant="verySmall"
              >
                Message sent
              </Button>
            )} */}
          </div>
        ) : null}
      </div>
      {!grid && !popoverCard && (
        <div className={clsx(isMobile && 'd-flex flex-column gap-2')}>
          {expertiseNames && <div>Expertise: {expertiseNames}</div>}
          {popoverCard ||
            (objectivesData && (
              <div
                className={clsx(
                  isMobile && 'd-flex flex-column gap-2',
                  classes.objectivesDiv
                )}
              >
                {objectivesData}
              </div>
            ))}
          {popoverCard || (priorities && <div>{priorities}</div>)}
        </div>
      )}
    </div>
  );
};
