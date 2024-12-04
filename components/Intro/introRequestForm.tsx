import classes from './introRequestForm.module.scss';
import clsx from 'clsx';
import {Divider} from '@/ds/Divider';
import {AvatarWithButton} from './avatarWithButton';
import {FacetState} from '@/utils/common/commonTypes';
import {useFacetState} from '../Common/Facets/useFacetState';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import {UpperHalfForm} from './upperHalfForm';
import {LowerHalfForm} from './lowerHalfForm';
import {IntroPreview} from './introPreview';
import {useSelector} from 'react-redux';
import {selectIntroFormUserDetails, selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import {Spinner} from '@/ds/Spinner';
import {Button, ButtonVariants} from '@/ds/Button';
import {
  checkAtLeastOneObjectEmpty,
  dropdownArrayToFacetValues
} from '@/utils/common/helper';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {checkAtleastOneInvalid, spreadState, stateToPayload} from './helper';
import {toast} from 'react-toastify';

export function applyLabel(
  label: string,
  JSX: JSX.Element,
  className?: string,
  alert?: boolean
) {
  return (
    <div className={clsx(className, 'ps-1')} key={`${label}_intro_Form`}>
      <div className={classes.smallText}>
        {label}
        {alert && <span className="text-danger">{' (required)'}</span>}
      </div>
      {JSX}
    </div>
  );
}
export const change = (
  setState: Dispatch<SetStateAction<IntroData>>,
  name: string,
  domain: 'user' | 'company',
  event: any
) =>
  setState(prev => ({
    ...prev,
    [domain]: {...prev[domain], [name]: event?.target?.value}
  }));

export const gridColumnExtendTwo = clsx(classes.gridColumnExtendTwo, 'w-100');
type str = string | null | undefined;
export interface IntroData {
  user: {
    name: str;
    avatarUrl: str;
    numberOfStartupsRun: number;
    totalValueOfExits: str;
    numberOfEmployeesHired: str;
    totalFundingRaised: str;
    accomplishments: str;
    excitingUpdates: str;
    requestExpireDate: str;
  };
  company: {
    name: str;
    logoUrl: str;
    pitchDeckUrl: str;
    description: str;
    website: str;
    techSectors: FacetState;
    location: str;
    monetizationStartegy: FacetState;
    targetMarket: str;
    visaSatus: str;
    revenueGrowthRateMOM: str;
    newUserGrowthRateMOM: str;
    currentMonthlyRevenue: str;
    lookingToRaise: str;
    currentFunding: str;
    notableInvestors: FacetState;
    pitchDeckLinkUrl: str;
  };
}
const IntroRequestForm: React.FC<{investorId: string}> = ({investorId}) => {
  const userDetails = useSelector(selectIntroFormUserDetails());
  const {selectedFacetValues, updateFacetValue, setSelectedFacetValues} =
    useFacetState();
  const [error, setError] = useState(false);
  const [state, setState] = useState<IntroData>(
    spreadState(userDetails, selectedFacetValues)
  );
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const [loading, setLoading] = useState(!userDetails);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector(selectUserInfo());
  const makeApiCall = useAPI();
  const fetchAllInfo = useCallback(async () => {
    try {
      await Promise.all([
        ...[
          'tech-sectors',
          'monetization-startegy',
          'locations',
          'target-market',
          'visa-status'
        ].map(infoType =>
          makeApiCall('getIntroFormInfo', {userId: user?.id, infoType})
        ),
        makeApiCall('getIntroUserDetails', {userId: user?.id, investorId})
      ]);
    } catch (err) {
      setError(true);
    }
  }, [user, makeApiCall]);
  const onUpload = useCallback(
    (URL: string, key: string, domain: 'company' | 'user') => {
      change(setState, key, domain, {
        target: {
          value: URL
        }
      });
      setUploadingImage(false);
    },
    []
  );
  const postData = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const {notableInvestors, ...checkedFacetStateObject} =
        selectedFacetValues;
      if (
        checkAtLeastOneObjectEmpty(...Object.values(checkedFacetStateObject)) ||
        checkAtleastOneInvalid(state)
      ) {
        setSubmitted(true);
        toast.error('Error, Invalid values', {theme: 'dark'});
        return;
      }
      try {
        setLoading(true);
        await makeApiCall(
          'postIntroUserDetails',
          {userId: user?.id, investorId},
          {data: stateToPayload(state, selectedFacetValues), method: 'POST'}
        );
        setSuccess(true);
      } catch (err) {
        toast.error('An error occured', {theme: 'dark'});
      } finally {
        setLoading(false);
      }
    },
    [
      user?.id,
      stateToPayload,
      investorId,
      makeApiCall,
      setLoading,
      setSuccess,
      state,
      selectedFacetValues
    ]
  );
  const PitchDeck = (
    <AvatarWithButton
      caption="Pitch Deck"
      avatarUrl={state?.company?.pitchDeckUrl}
      onUploadStart={() => setUploadingImage(true)}
      onUpload={URL => onUpload(URL, 'pitchDeckUrl', 'company')}
      onError={() => setUploadingImage(false)}
      profileId={user?.profileId}
      type="pitchDeck"
      inputUrl={{
        url: state?.company?.pitchDeckLinkUrl ?? '',
        onChange: e => change(setState, 'pitchDeckLinkUrl', 'company', e)
      }}
    />
  );
  useEffect(() => {
    if (!userDetails?.user && user?.id) {
      fetchAllInfo();
    }
  }, [user?.id]);
  useEffect(() => {
    if (userDetails) {
      setState(spreadState(userDetails, selectedFacetValues));
      setSelectedFacetValues({
        techSectors: dropdownArrayToFacetValues(
          userDetails?.company?.techSectors
        ),
        monetizationStartegy: dropdownArrayToFacetValues(
          userDetails?.company?.monetizationStartegy
        ),
        notableInvestors: dropdownArrayToFacetValues(
          userDetails?.company?.notableInvestors
        )
      });
      setLoading(false);
    }
  }, [userDetails]);
  if (success)
    return (
      <div className={classes.fullScreen}>
        <h5>Your Introduction Request sent successfully</h5>
      </div>
    );
  if (error)
    return (
      <div className={classes.fullScreen}>
        <h5>Something went wrong</h5>
      </div>
    );
  if (loading)
    return (
      <div className={classes.fullScreen}>
        <Spinner />
      </div>
    );

  return (
    <form
      onSubmit={postData}
      onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
    >
      <div className={classes.container}>
        <div className={classes.left}>
          <h4 className="text-center">{user?.name}</h4>
          <div className={clsx('d-flex', isMobile && 'flex-column')}>
            <AvatarWithButton
              avatarUrl={state?.user?.avatarUrl}
              caption="Change Photo"
              onUpload={URL => onUpload(URL, 'avatarUrl', 'user')}
              onError={() => setUploadingImage(false)}
              profileId={user?.profileId}
              type="profileImageUrl"
              onUploadStart={() => setUploadingImage(true)}
            />
            <div className={classes.upperHalfGrid}>
              <UpperHalfForm
                state={state}
                setState={setState}
                submitted={submitted}
              />
            </div>
          </div>
          <Divider className={classes.margined} />
          <h4 className="text-center">
            {user?.company_name ?? 'Company Info'}
          </h4>
          <div className={classes.lowerGrid}>
            <AvatarWithButton
              avatarUrl={state?.company?.logoUrl}
              caption="Change Logo"
              profileId={user?.profileId}
              type="companyImageUrl"
              onUpload={URL => onUpload(URL, 'logoUrl', 'company')}
              onError={() => setUploadingImage(false)}
              onUploadStart={() => setUploadingImage(true)}
            />
            <LowerHalfForm
              state={state}
              setState={setState}
              selectedFacetValues={selectedFacetValues}
              updateFacetValue={updateFacetValue}
              PitchDeck={PitchDeck}
              submitted={submitted}
            />
          </div>
        </div>
        <div className={classes.divider}></div>
        <div className={classes.right}>
          <IntroPreview
            state={state}
            facetState={selectedFacetValues}
            company={user?.company_name}
            userName={user?.name}
          />
        </div>
      </div>
      <div className={clsx(classes.doubleBordered, 'py-2 mt-2 text-center')}>
        <div className="mb-2">
          <Button
            variant={ButtonVariants.Primary}
            disabled={uploadingImage}
            type="submit"
            id="intro-request-form-submit-button"
          >
            Send Request
          </Button>
        </div>
        <h6 className="m-0">
          If the Investor accepts your request, we will send an intro email to
          you both to begin the conversation
        </h6>
      </div>
    </form>
  );
};
export {IntroRequestForm};
