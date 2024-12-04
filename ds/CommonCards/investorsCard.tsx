import React, {useCallback, useState} from 'react';
import Card from '../Card/card';
import CardContent from '../Card/cardContent';
import Avatar from '../Avatar/avatar';
import classes from '@/ds/CommonCards/commonCards.module.scss';
import clsx from 'clsx';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {CommonCardFooter} from './components/commonCardFooter';
import {CONST_INVESTOR} from '@/utils/common/constants';
import {IntroButtonContainer} from '@/ds/CommonCards/components/introButtonContainer';
import {InvestorCardRightPanel} from './components/investorCardRightPanel';

import {useUserDetailQuery} from '@/genericApi/foundersNetwork/queries/useUserDetailQuery';
import {useSession} from 'next-auth/react';

import {useRouter} from 'next/router';
import IntroRequestModal from '@/components/IntroRequestModal';

export interface InvestorsCardData {
  id: string;
  profileId?: string;
  firstName: string;
  lastName: string;
  badge: string;
  avatarUrl: string;
  dateTime: {
    creationDate: string;
  };
  messageSent?: boolean;
  introRequested?: boolean;
  designation: string;
  companyName: string;
  background: string;
  investmentAmount?: string;
  investorProfileId: string;
  investsIn: {
    name: string;
    id: string;
  }[];
  city: {
    name: string;
    id: string;
  }[];
  sector: {
    name: string;
    id: string;
  }[];
}

interface InvestorsCardProps {
  data: InvestorsCardData;
  grid?: boolean;
  popoverCard?: boolean;
}

export const InvestorsCard: React.FC<InvestorsCardProps> = ({
  data: {
    id,
    profileId,
    firstName,
    lastName,
    badge,
    avatarUrl,
    introRequested,
    designation,
    companyName,
    background,
    investmentAmount,
    investsIn,
    city,
    sector
  },
  grid = false,
  popoverCard = false
}) => {
  const router = useRouter();
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const redirectURL = `investor/${profileId}`;
  const [showIntroForm, setShowIntroForm] = useState(false);
  // TODO: Add condition for validating remaining intros for intro modal
  const introClickHandler = useCallback(() => setShowIntroForm(true), []);

  const {data: session} = useSession();

  const userId = session?.user.id;

  const {data: userData} = useUserDetailQuery(userId);

  const hasInvestorContactPermission = userData?.paymentPlan !== 'bootstrap';

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

  const handlePromptUpgrade = () => {
    router.push('/raise?stage=angel');
  };

  return (
    <div className={clsx(popoverCard && 'w-100', wrapperClassName)}>
      {showIntroForm && hasInvestorContactPermission && profileId && (
        <IntroRequestModal
          memberName={userData?.name}
          investorId={id}
          investorProfileId={profileId}
          investorName={`${firstName} ${lastName}`}
          show={showIntroForm}
          setShow={setShowIntroForm}
          onHide={() => setShowIntroForm(false)}
        />
      )}
      <Card className="position-relative">
        <CardContent className={cardContentContainerClassName}>
          {!introRequested && (
            <div>
              <IntroButtonContainer
                grid={grid}
                introClickHandler={
                  hasInvestorContactPermission
                    ? introClickHandler
                    : handlePromptUpgrade
                }
                isMobile={isMobile}
              />
            </div>
          )}

          <div className={flexContainerClassName}>
            <div className="text-center">
              <Avatar
                avatarUrl={avatarUrl}
                altText={`${firstName} Image`}
                imageWidth={grid ? 130 : 110}
                imageHeight={grid ? 130 : 110}
                newDesign={true}
                badge={badge}
                profileURL={redirectURL}
              />
            </div>
            <InvestorCardRightPanel
              grid={grid}
              isMobile={isMobile}
              companyName={companyName}
              designation={designation}
              firstName={firstName}
              lastName={lastName}
              background={background}
              investmentAmount={investmentAmount}
              redirectURL={redirectURL}
              introClickHandler={introClickHandler}
              popoverCard={popoverCard}
              introRequested={introRequested}
              hasInvestorContactPermission={hasInvestorContactPermission}
            />
          </div>
        </CardContent>
        {!grid && (
          <CommonCardFooter
            city={city}
            sector={sector}
            popoverCard={popoverCard}
            investsIn={investsIn}
            cardType={CONST_INVESTOR}
          />
        )}
      </Card>
    </div>
  );
};
