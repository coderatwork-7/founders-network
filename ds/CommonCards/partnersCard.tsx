import React, {useCallback} from 'react';
import Card from '../Card/card';
import CardContent from '../Card/cardContent';
import Avatar from '../Avatar/avatar';

import classes from '@/ds/CommonCards/commonCards.module.scss';
import clsx from 'clsx';
import {CommonCardFooter} from './components/commonCardFooter';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {PartnerCardRightPanel} from './components/partnerCardRightPanel';
import {IntroButtonContainer} from './components/introButtonContainer';
import Link from 'next/link';
import {Button, ButtonVariants} from '../Button';
import {CONST_PARTNER, ROLES} from '@/utils/common/constants';
import useIntroModal from '@/hooks/useIntroModal';

export interface PartnersCardData {
  id: string;
  firstName: string;
  lastName: string;
  badge: string;
  avatarUrl: string;
  dateTime: {
    creationDate: string;
  };
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
  city: {
    name: string;
    id: string;
  };
  stage: {
    name: string;
    id: string;
  };
  sector: {
    name: string;
    id: string;
  }[];
  cohort?: string;
  messageSent?: boolean;
  introRequested?: boolean;
}

interface PartnersCardProps {
  data: PartnersCardData;
  grid?: boolean;
  popoverCard?: boolean;
  messageClickHandler: () => void;
}

export const PartnersCard: React.FC<PartnersCardProps> = ({
  data: {
    id,
    avatarUrl,
    firstName,
    lastName,
    designation,
    companyName,
    expertise,
    badge,
    city,
    stage,
    objectives,
    priorities,
    sector,
    cohort,
    introRequested,
    messageSent
  },
  grid = false,
  popoverCard = false,
  messageClickHandler
}) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const redirectURL = `/profile/${id}`;
  const openIntroModal = useIntroModal();

  const introClickHandler = useCallback(() => {
    openIntroModal({
      profileId: id,
      firstName,
      lastName,
      role: ROLES.PARTNER_LIMITED
    });
  }, []);

  const wrapperClassName = clsx(classes.wrapper, grid && classes.grid);
  const cardContentContainerClassName = clsx(
    'm-0',
    classes.cardContentContainer,
    grid && classes.grid,
    isMobile && classes.mobile
  );
  const flexContainerClassName = clsx(
    'd-flex',
    !isMobile && 'gap-3',
    isMobile && 'gap-1 flex-column align-items-center',
    grid && 'flex-column justify-content-center align-items-center text-center',
    grid && classes.grid
  );
  const showIntro = !grid && !isMobile;
  return (
    <div className={clsx(popoverCard && 'w-100', wrapperClassName)}>
      <Card className="position-relative">
        <CardContent className={cardContentContainerClassName}>
          <div>
            {/* {!introRequested && !messageSent && ( */}
            {!introRequested && (
              <IntroButtonContainer
                grid={grid}
                introClickHandler={introClickHandler}
                isMobile={isMobile}
                messageClickHandler={messageClickHandler}
              />
            )}
            {showIntro && introRequested && (
              <Button
                variant={ButtonVariants.CardPrimary}
                subVariant="verySmall"
                disabled
                className={clsx(classes.introButton, 'fw-normal')}
              >
                Pending Intro
              </Button>
            )}
            {/* {showIntro && !introRequested && messageSent && (
              <Button
                variant={ButtonVariants.CardPrimary}
                subVariant="verySmall"
                className={clsx(classes.introButton)}
              >
                Message sent
              </Button>
            )} */}
          </div>

          <div className={flexContainerClassName}>
            <div className="text-center">
              <Avatar
                avatarUrl={avatarUrl}
                altText={`${firstName} Image`}
                imageWidth={110}
                imageHeight={110}
                newDesign={true}
                badge={badge}
                profileURL={redirectURL}
              />

              {popoverCard && cohort ? (
                <div>
                  <Link href={`/members/?cohort=${cohort}`}>{cohort}</Link>
                </div>
              ) : null}
            </div>
            <PartnerCardRightPanel
              grid={grid}
              isMobile={isMobile}
              companyName={companyName}
              designation={designation}
              expertise={expertise}
              firstName={firstName}
              lastName={lastName}
              priorities={priorities}
              redirectURL={redirectURL}
              objectives={objectives}
              introClickHandler={introClickHandler}
              messageClickHandler={messageClickHandler}
              popoverCard={popoverCard}
              messageSent={messageSent}
              introRequested={introRequested}
            />
          </div>
        </CardContent>
        {!grid && (
          <CommonCardFooter
            city={city}
            stage={stage}
            sector={sector}
            popoverCard={popoverCard}
            cardType={CONST_PARTNER}
          />
        )}
      </Card>
    </div>
  );
};
