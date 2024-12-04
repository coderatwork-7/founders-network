import {FacetState} from '@/utils/common/commonTypes';
import {IntroData} from './introRequestForm';
import {
  facetStateToFacetValueArray,
  safelyExtractIntegerFromString
} from '@/utils/common/helper';
export const NOT_SET = 'Not Set';
export const stateToPayload = (state: IntroData, facetState: FacetState) => {
  const facets = Object.entries(facetStateToFacetValueArray(facetState)).reduce(
    (acc, [key, array]) => Object.assign(acc, {[key]: array.map(e => e?.[1])}),
    {}
  );
  const {logoUrl, pitchDeckUrl, ...new_company} = state?.company ?? {};

  const {avatarUrl, requestExpireDate, ...new_user} = state?.user ?? {};
  return {
    user: {
      ...new_user,
      numberOfStartupsRun: parseInt(`${new_user.numberOfStartupsRun}`),
      numberOfEmployeesHired:
        new_user?.numberOfEmployeesHired === '1000+'
          ? 1001
          : parseInt(`${new_user?.numberOfEmployeesHired?.split('-')?.[1]}`)
    },
    company: {
      ...new_company,
      revenueGrowthRateMOM: parseInt(`${new_company?.revenueGrowthRateMOM}`),
      newUserGrowthRateMOM: parseInt(`${new_company?.newUserGrowthRateMOM}`),
      lookingToRaise: parseInt(`${new_company?.lookingToRaise}`),
      currentFunding: parseInt(`${new_company?.currentFunding}`),
      ...facets
    }
  };
};

export const notValid = (element: any) =>
  !element || element === NOT_SET || element === '----';

const ignoreValidationInComany = {
  pitchDeckUrl: true,
  pitchDeckLinkUrl: true,
  logoUrl: true
};
export const checkAtleastOneInvalid = (state: IntroData) => {
  for (const [key, value] of Object.entries(state?.user ?? {}))
    if (key !== 'requestExpireDate' && notValid(value)) return true;

  for (const [key, value] of Object.entries(state?.company ?? {}))
    if (
      !ignoreValidationInComany[key as keyof typeof ignoreValidationInComany] &&
      notValid(value)
    )
      return true;
  return false;
};

export const spreadState = (
  userDetails: IntroData,
  selectedFacetValues: FacetState
): IntroData => ({
  ...userDetails,
  company: {
    ...userDetails?.company,
    newUserGrowthRateMOM: safelyExtractIntegerFromString(
      userDetails?.company?.newUserGrowthRateMOM
    ),
    revenueGrowthRateMOM: safelyExtractIntegerFromString(
      userDetails?.company?.revenueGrowthRateMOM
    ),
    lookingToRaise: safelyExtractIntegerFromString(
      userDetails?.company?.lookingToRaise
    ),
    currentFunding: safelyExtractIntegerFromString(
      userDetails?.company?.currentFunding
    ),
    techSectors: selectedFacetValues,
    monetizationStartegy: selectedFacetValues,
    notableInvestors: selectedFacetValues
  }
});
