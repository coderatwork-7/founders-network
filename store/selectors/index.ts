import {CONST_FORUMS, PARTNER_ROLES} from '@/utils/common/constants';
import {RootState} from '..';
import {Session} from 'next-auth';
import {ForumCardResponse} from '@/components/Cards/Forum/forumCard';
import {ProfileData, IntroductionsData, AllUpdatesData} from '@/types/profile';
import {DealsPageResponse} from '@/components/Deals/dealsList';
import {
  settingsGeneralData,
  settingsCompanyData,
  settingsProfileData
} from '@/types/settings';
import {
  convertObjectUsingReverseMapping,
  getFeedData
} from '@/utils/common/helper';
import {CacheType} from '../reducers/userSlice';
import {
  MINI_PROFILE_API_MEMBER_MAP,
  MINI_PROFILE_API_PARTNER_MAP,
  PROFILE_API_MEMBER_MAP,
  PROFILE_API_PARTNER_MAP
} from '@/utils/common/apiToStoreMaps';
import {ProfileDetails} from '@/components/ProfileTooltip/components/popoverCard';

export const selectFeedIds = (feedsType: string) => {
  return (state: RootState) => state.feedsRepository[feedsType]?.allIds;
};
export const selectFeed = (feedType: string, id: string | number) => {
  return (state: RootState) => getFeedData(state, feedType, id);
};
export const selectAllTags = () => {
  return (state: RootState) => state?.feedsRepository?.info?.tags;
};
export const selectAllMembers = () => {
  return (state: RootState) => state?.feedsRepository?.info?.members;
};
export const selectNominationInfo = () => {
  return (state: RootState) => state.nominationRepository?.nomination?.info;
};
export const selectRemainingIntrosInfo = () => {
  return (state: RootState) =>
    state.userRepository?.details?.info?.remainingIntroRequests;
};
export const selectAllCalendarEvents = () => {
  return (state: RootState) =>
    state.functionsRepository?.calendar?.allEvents || [];
};
export const selectCalendarMonthsLoaded = () => {
  return (state: RootState) =>
    state.functionsRepository?.calendar?.monthsLoaded || [];
};
export const selectFacets = (page: string) => {
  return (state: RootState) => state?.facetsRepository?.[page]?.facets;
};
export const selectFunctionCard = (id: string) => {
  return (state: RootState) => state?.functionsRepository?.functions?.[id];
};

export const selectProfileInfoIsPartner = (profileId: any) => {
  return (state: RootState): any => {
    return PARTNER_ROLES.includes(
      state.profileRepository?.profileData?.[profileId]?.role
    );
  };
};

export const selectProfileData = (profileId: any) => {
  return (state: RootState): ProfileData => {
    const profileInfo = state.profileRepository?.profileData?.[profileId] ?? {};
    const isPartner = PARTNER_ROLES.includes(profileInfo.role);
    if (!profileInfo?.isProfileAvailable) return null as unknown as ProfileData;
    return (
      isPartner
        ? convertObjectUsingReverseMapping(
            state.partnersRepository?.partners?.[profileId],
            PROFILE_API_PARTNER_MAP
          )
        : convertObjectUsingReverseMapping(
            state.membersRepository?.posts?.[profileId],
            PROFILE_API_MEMBER_MAP
          )
    ) as ProfileData;
  };
};

export const selectMiniProfile = (profileId: string | number) => {
  return (state: RootState): ProfileDetails => {
    const profileInfo = state.profileRepository?.profileData?.[profileId] ?? {};
    const isPartner = PARTNER_ROLES.includes(profileInfo.role);
    if (!profileInfo?.isMiniProfileAvailable)
      return null as unknown as ProfileDetails;
    return (
      isPartner
        ? convertObjectUsingReverseMapping(
            state.partnersRepository?.partners?.[profileId],
            MINI_PROFILE_API_PARTNER_MAP
          )
        : convertObjectUsingReverseMapping(
            state.membersRepository?.posts?.[profileId],
            MINI_PROFILE_API_MEMBER_MAP
          )
    ) as ProfileDetails;
  };
};

export const selectNotifications = () => {
  return (state: RootState) => state.userRepository?.notifications;
};
export const selectOnboardingInfo = () => {
  return (state: RootState) => state.userRepository?.userInfo?.onboarding;
};
export const selectChatData = () => {
  return (state: RootState) => state.chatRepository;
};
export const selectUserMsgs = (chatUserId: number) => {
  return (state: RootState) => state.chatRepository[chatUserId];
};
export const selectCardInfo = () => {
  return (state: RootState) => state.userRepository?.details?.creditCard;
};
export const selectApiState = (apiName: string) => {
  return (state: RootState) => state?.apiRepository?.api?.[apiName]?.inprogress;
};
export const selectProfileIntroductions = () => {
  return (state: RootState): IntroductionsData =>
    state.profileRepository?.introductions;
};
export const selectProfileAllUpdates = () => {
  return (state: RootState): AllUpdatesData =>
    state.profileRepository?.allUpdates;
};
export const selectSettingsGeneralData = () => {
  return (state: RootState): settingsGeneralData =>
    state.userRepository?.details?.generalSettings?.generalData;
};
export const selectSettingsCompanyData = () => {
  return (state: RootState): settingsCompanyData =>
    state.userRepository?.details?.companySettings?.companyData;
};
export const selectSettingsProfileData = () => {
  return (state: RootState): settingsProfileData =>
    state.userRepository?.details?.profileSettings?.profileData;
};
export const selectSettingsProfileNominatorOptions = () => {
  return (state: RootState): any =>
    state.userRepository?.details?.profileSettings?.nominatorOptions;
};
export const selectSettingsProfileExpertiseOptions = () => {
  return (state: RootState): any =>
    state.userRepository?.details?.profileSettings?.expertiseOptions;
};
export const selectSettingsProfileChapterOptions = () => {
  return (state: RootState): any =>
    state.userRepository?.details?.profileSettings?.chapterOptions;
};
export const selectSettingsCompanySectorsOptions = () => {
  return (state: RootState): any =>
    state.userRepository?.details?.companySettings?.sectorsOptions;
};
export const selectSettingsCompanyInvestmentsOptions = () => {
  return (state: RootState): any =>
    state.userRepository?.details?.companySettings?.investmentsOptions;
};
export const selectSettingsCompanyAcceleratorOptions = () => {
  return (state: RootState): any =>
    state.userRepository?.details?.companySettings?.acceleratorOptions;
};
export const selectUserInfo: () => (
  state: RootState // eslint-disable-line no-unused-vars
) => Session['user'] = () => {
  return (state: RootState) => state.userRepository?.userInfo;
};
export const selectFunctionCalendarLinks = (functionId: string) => {
  return (state: RootState) =>
    state.functionsRepository?.functions?.[functionId]?.addToCalendar;
};
export const selectForumPost: (
  id: string | number // eslint-disable-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
) => (state: RootState) => ForumCardResponse = selectFeed.bind(
  {},
  CONST_FORUMS
);

export const selectObjectives = () => (state: RootState) =>
  state?.userRepository?.objectives?.facetState;

export const selectHelpingMembers = () => (state: RootState) =>
  state?.membersRepository?.allMembers?.data;

export const selectUserExpertise = () => (state: RootState) =>
  state?.userRepository?.expertise?.data;

export const selectMembersPosts = () => (state: RootState) =>
  state?.membersRepository?.posts;

export const selectInvestors = () => (state: RootState) =>
  state?.investorsRepository?.investors;

export const selectInvestorDetail = (id: string) => (state: RootState) =>
  state?.investorsRepository?.investors?.[id];

export const selectGroups = () => (state: RootState) =>
  state?.groupsRepository?.groups;

export const selectPartners = () => (state: RootState) =>
  state?.partnersRepository?.partners;

export const selectPartner = (id: string) => (state: RootState) =>
  state?.partnersRepository?.partners?.[id];

// eslint-disable-next-line no-unused-vars
export const selectDeals: () => (state: RootState) => {
  [key: string]: DealsPageResponse;
} = () => state => state?.dealsRepository?.deals;
export const selectMembershipPlan = () => {
  return (state: RootState) => state.membershipPlanRepository;
};
export const selectDeal = (id: string) => {
  return (state: RootState) => state?.dealsRepository?.deals?.[id];
};
export const selectIntroFormDetails = () => (state: RootState) =>
  state?.investorsRepository?.details;

export const selectIntroFormUserDetails = () => (state: RootState) =>
  state?.investorsRepository?.userInfo?.details;
export const selectInvestmentSettings = () => {
  return (state: RootState) =>
    state?.investorsRepository?.info?.investmentSettings;
};
export const selectFunctionTicketInfo = (id: string) => {
  return (state: RootState) => ({
    tickets: state?.functionsRepository?.functions?.[id].tickets,
    bookedTickets: state?.functionsRepository?.functions?.[id].bookedTickets,
    credits: state?.userRepository?.details?.info?.credits
  });
};
export const selectGroupDetails = (id: string) => (state: RootState) =>
  state?.groupsRepository?.groupDetails?.[id];
export const selectInvestorInfo = (type: string) => (state: RootState) =>
  state?.userRepository?.[type];

export const selectCacheData = (key: CacheType) => (state: RootState) =>
  state?.userRepository?.cache?.[key];

export const selectDealListingFee = () => (state: RootState) =>
  state?.dealsRepository?.dealListingFee;

export const selectAllDealTags = () => (state: RootState) =>
  state?.dealsRepository?.dealTags;

export const selectLibraryItems = (type: string) => (state: RootState) =>
  state?.libraryRepository?.[type];

export const selectLibraryItem =
  (type: string, id?: number) => (state: RootState) =>
    id ? state?.libraryRepository?.[type]?.[id] : null;

export const selectLibraryTags = (type: string) => (state: RootState) =>
  state?.libraryRepository?.tags?.[type];
export const selectAdminFeedbacks = () => (state: RootState) =>
  state?.adminRepository?.siteFeedback;

export const selectFunctionRSVP = (functionId: string) => (state: RootState) =>
  state?.adminRepository?.functions?.[functionId];

export const selectFunctionDeclineReasons = () => (state: RootState) =>
  state?.adminRepository?.functions?.declineReasons;
export const selectAdminFunctionTags = (type?: string) => (state: RootState) =>
  type
    ? state?.functionsRepository?.tags?.[type]
    : state?.functionsRepository?.tags;

export const selectAllMembersList = () => (state: RootState) =>
  state?.adminRepository?.functions?.allMembers;
