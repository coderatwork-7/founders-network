import clsx from 'clsx';
import {IntroData} from './introRequestForm';
import classes from './introRequestForm.module.scss';
import {checkURL, facetStateToFacetValueArray} from '@/utils/common/helper';
import {FacetState} from '@/utils/common/commonTypes';
import Image from 'next/image';
import {useEffect, useMemo, useState} from 'react';
import {VideoModal} from '@/ds/VideoModal';
import {NOT_SET} from './helper';
interface IntroPreviewProps {
  state: IntroData;
  facetState: FacetState;
  company?: string;
  userName?: string;
}
const userNameMapping: any = {
  numberOfStartupsRun: 'Number of startups',
  totalValueOfExits: 'Value of exits',
  totalFundingRaised: 'Lifetime Funding',
  numberOfEmployeesHired: 'Employees Hired'
};
const userCompanyMapping = {
  lookingToRaise: 'Looking to Raise',
  currentFunding: 'Funding To Date',
  targetMarket: 'Target Market',
  monetizationStartegy: 'Monetization',
  currentMonthlyRevenue: 'Monthly Revenue',
  revenueGrowthRateMOM: 'Revenue Growth Rate',
  newUserGrowthRateMOM: 'New User Grow Rate',
  notableInvestors: 'Notable Investors'
};
type keyofUserMapping = keyof typeof userNameMapping;
type keyofCompanyMapping = keyof typeof userCompanyMapping;
const render = (
  key: string,
  displayText: string,
  state: IntroData,
  domain: 'user' | 'company',
  facetArrays: {
    [key: string]: [string, string][];
  }
) => (
  <div
    className={clsx('d-flex my-1 justify-content-between textSmall')}
    key={`${key}_${domain}_${displayText}`}
  >
    <span>{displayText}:</span>
    <span className={classes.maxWidth}>
      <span className={classes.wrap}>
        {typeof (state as any)?.[domain]?.[key] === 'object'
          ? facetArrays?.[key]?.map(([value, fkey], index) => (
              <span key={`${key}_${value}_${fkey}`}>
                {value}
                {index !== facetArrays?.[key]?.length - 1 && ', '}
              </span>
            ))
          : (state as any)?.[domain]?.[key]}
      </span>
    </span>
  </div>
);
const IntroPreview: React.FC<IntroPreviewProps> = ({
  state,
  facetState,
  company,
  userName
}) => {
  const facetArrays = facetStateToFacetValueArray(facetState);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [, setLocation] = useState(false);
  const PitchDeck = useMemo(
    () =>
      state?.company?.pitchDeckUrl && (
        <Image
          alt="Pitch Deck"
          src={checkURL(state?.company?.pitchDeckUrl) ?? ''}
          className={classes.previewImg}
          width={80}
          height={80}
          onError={() => {}}
        />
      ),
    [state?.company?.pitchDeckUrl]
  );
  useEffect(() => {
    setLocation(true);
  }, []);
  return (
    <div
      className={clsx(
        'container-border',
        classes.previewBg,
        classes.smallScreenPreview
      )}
    >
      <h4 className="text-center mt-1">Email Preview</h4>
      <div className="d-flex gap-1 px-3">
        {state?.user?.avatarUrl && (
          <Image
            alt="User"
            src={checkURL(state?.user?.avatarUrl) ?? ''}
            className={classes.previewImg}
            width={80}
            height={80}
          />
        )}
        {state?.company?.logoUrl && (
          <Image
            alt="Company"
            src={checkURL(state?.company?.logoUrl) ?? ''}
            className={classes.previewImg}
            width={80}
            height={80}
          />
        )}
        {PitchDeck}
        <div>
          <p
            className="linkText cursorPointer m-0 smallText"
            onClick={() => setShowPitchDeck(true)}
          >
            Show Pitch Deck
          </p>
          <p className="m-0 smallText">Expires on</p>
          <p className="m-0 smallText">
            {state?.user?.requestExpireDate ?? 'N/A'}
          </p>
        </div>
      </div>
      <div className={clsx('p-3', classes.maxWidthPreview)}>
        {`${userName} of `}
        <a href={state?.company?.website ?? ''} target="__blank">
          {company ?? 'Company'}
        </a>
        <p className={classes.wrap}>{`${state?.company?.description}`}</p>
        <p className={classes.wrap}>{`Location: ${
          (location &&
            (
              document?.getElementById(
                'intro-form-location'
              ) as HTMLSelectElement
            )?.selectedOptions?.[0]?.textContent) ??
          NOT_SET
        }`}</p>
      </div>
      <div className="p-3">
        <h4 className="pb-2">{`${userName ?? 'User'} stats`}</h4>
        {Object.entries(userNameMapping).map(
          ([key, displayText]: [
            keyofUserMapping,
            (typeof userNameMapping)[keyofUserMapping]
          ]) => render(key as string, displayText, state, 'user', facetArrays)
        )}
      </div>
      <div className="p-3">
        <h4 className="py-2">{`${company ?? 'Company'} stats`}</h4>
        {Object.entries(userCompanyMapping).map(
          ([key, displayText]: [
            string,
            (typeof userCompanyMapping)[keyofCompanyMapping]
          ]) => render(key, displayText, state, 'company', facetArrays)
        )}
      </div>
      {showPitchDeck && (
        <VideoModal
          handleCloseModal={() => setShowPitchDeck(false)}
          imageSrc={state?.company?.pitchDeckUrl ?? ''}
          showModal={showPitchDeck}
          link={state?.company?.pitchDeckLinkUrl ?? ''}
        />
      )}
    </div>
  );
};
export {IntroPreview};
