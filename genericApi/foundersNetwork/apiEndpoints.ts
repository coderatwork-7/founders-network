import createApiEndpoint from '@/genericApi/apiEndpointFactory';
import {createGetFeeds} from './feedsAPI';
import {createGetSearchResults, createGetSearchSuggestions} from './searchAPI';
import {createPostLike} from './likeAPI';
import {createDownloadFromLink, createPostFile} from './fileUploadAPI';
import {
  createGetForumMembers,
  createGetForumTags,
  createGetForumPosts,
  createGetForumDetail,
  createGetSuggestedPosts,
  createPostRemoveSuggestedPosts,
  createPostCreateForumPost,
  createPostEditForumPost,
  createPostFollowPost,
  createPutMuteForumPost,
  createDeleteForumPost
} from './forumAPI';
import {
  createGetNominationInfo,
  createGetNominationStatsInfo,
  createPostFeedback,
  createPostNominations,
  createPostNominationsRequest,
  createGetSavePreferences,
  createGetOverViewData,
  createGetSectorData,
  createGetStagesData,
  createGetLocation,
  createPutSavePreferences,
  createPutOverviewData
} from './nominateAPI';
import {
  createDownloadCalendar,
  createGetAdminFunctionTags,
  createGetCalendarEvents,
  createGetFunctionCalendarLinks,
  createGetFuntionsDetails,
  createPostNewFunction,
  createSaveFunctionDraft
} from './functionsAPI';
import {
  createDeleteComment,
  createGetForumComments,
  createPostForumComment,
  createPutEditComment,
  createPutFollowMute
} from './commentsAPI';
import {createGetFacets} from './facetsAPI';
import {createGetFunctionPageFeeds} from './functionPage';
import {
  createGetAllMembers,
  createGetMemberExpertise,
  createGetMembersObjectives,
  createGetMembersPageFeeds,
  createPutObjectives
} from './membersAPI';
import {
  createRemoveNotification,
  createGetNotifications,
  createMarkNotificationsChecked,
  createMarkNotificationRead
} from './notificationsAPI';
import {
  createGetChatUsers,
  createGetMembers,
  createGetUserMessages,
  createGetViewMessage,
  createPostMessage,
  createGetAllViewMessage
} from './chatAPI';
import {
  createGetFunctionTickets,
  createPostBookTickets,
  createPostDeclineFunction,
  createPostFunctionQuestion,
  createPostRemoveTickets
} from './FunctionTicketsAPI';
import {createCreditCardAPI} from './creditCardAPI';
import {
  createAddDeal,
  createDealTags,
  createDealsListingFee,
  createGetDealInfo,
  createGetDeals,
  createPostRateDeal,
  createPostRedeemDeal
} from './dealsAPI';
import {
  createMembershipPlan,
  createMembershipUpgradePlan,
  updateMembershipUpgradePlan
} from './membershipPlanAPI';
import {
  createGetUserProfile,
  createGetUserProfileAllUpdates,
  createGetUserProfileIntroductions,
  updateUserOnboardingStatus,
  createPostIntroRequest,
  createGetMiniProfile,
  createPostSiteFeedback,
  createGetCompanyProfile
} from './profileAPI';
import {
  createGetIntroFormInfo,
  createGetIntroUserDetails,
  createPostIntroUserDetails,
  createGetInvestorsPageFeeds,
  createInvestmentSettingsAPI,
  createInvestorOverview,
  createGetIntroRequestsCount,
  createInvestorDetails,
  createFundraisingInfoAPI
} from './investorsAPI';
import {createPostUploadImage} from './imageUploadAPI';
import {
  createGetSettingsCompanyData,
  createGetSettingsCompanyInvestmentsOptions,
  createGetSettingsCompanySectorsOptions,
  createGetSettingsProfileChapterOptions,
  createGetSettingsProfileExpertiseOptions,
  createGetSettingsGeneralData,
  createPutSettingsCompanyData,
  createPutSettingsGeneralData,
  createGetSettingsProfileData,
  createPutSettingsProfileData,
  createGetSettingsProfileNominatorOptions,
  createGetSettingsCompanyAcceleratorOptions
} from './settingsAPI';
import {
  createGetGroupDetails,
  createGetGroupsPageFeeds,
  createPostJoinGroup,
  createPostRequestInviteGroup
} from './groupsAPI';
import {createGetPartnersPageFeeds} from './partnersAPI';
import {createGetMentionData} from './mentionAPI';
import {
  createGetFunctionRSVP,
  createGetSiteFeedback,
  createGetFunctionDeclineReasons,
  createPostFunctionEmailListing,
  createGetFunctionRSVPList,
  createGetAllMembersList,
  createPostFunctionManageRSVP,
  createPostFunctionRemoveMember,
  createPostFunctionAddRSVP
} from './adminAPI';
import {
  createGetApplicationFormTags,
  createGetPaymentPlans,
  createGetProfileIdData,
  createGetSectors,
  createGetTestimonials,
  createPostApplicationForm
} from './applicationFormAPI';
import {
  createGetHelpCenterTags,
  createGetLibraryItem,
  createGetLibraryTags,
  createGetSearchLibrary,
  createLibraryDeleteAPI,
  createLibraryUpdateAPI
} from './libraryAPI';
import {createGetUniversities} from './universitiesAPI';

const createMockApi = createApiEndpoint(
  process.env.NEXT_PUBLIC_MOCK_API_SERVER_URL ?? ''
);

const createFoundersApi = createApiEndpoint(
  process.env.NEXT_PUBLIC_API_DOMAIN_URL ?? ''
);

function createAPI(isMock: boolean) {
  if (isMock) return createMockApi;
  else return createFoundersApi;
}

const apis = {
  getUniversities: createGetUniversities,
  getFeeds: createGetFeeds(),
  getSearchSuggestions: createGetSearchSuggestions(),
  getSearchResults: createGetSearchResults(),
  postLike: createPostLike(),
  getForumMembers: createGetForumMembers(),
  getForumTags: createGetForumTags(),
  getNominationInfo: createGetNominationInfo(),
  getNominationStatsInfo: createGetNominationStatsInfo(),
  postNominations: createPostNominations(),
  postNominationsRequest: createPostNominationsRequest(),
  getSavePrefrences: createGetSavePreferences(),
  getOverViewData: createGetOverViewData(),
  getSectorsData: createGetSectorData(),
  getStagesData: createGetStagesData(),
  getLocation: createGetLocation(),
  putSavePreferences: createPutSavePreferences(),
  putOverviewData: createPutOverviewData(),
  getNotifications: createGetNotifications(),
  postRemoveNotification: createRemoveNotification(),
  getMarkNotificationsChecked: createMarkNotificationsChecked(),
  postMarkNotificationRead: createMarkNotificationRead(),
  postFeedback: createPostFeedback(),
  getCalendarEvents: createGetCalendarEvents(),
  getForumComments: createGetForumComments(),
  getFacets: createGetFacets(),
  getFunctionPageFeeds: createGetFunctionPageFeeds(),
  getMiniProfile: createGetMiniProfile(),
  getCompanyProfile: createGetCompanyProfile(),
  getChatUsers: createGetChatUsers(),
  getViewMessages: createGetViewMessage(),
  getAllViewMessages: createGetAllViewMessage(),
  getUserMessages: createGetUserMessages(),
  getMembers: createGetMembers(),
  getFunctionTickets: createGetFunctionTickets(),
  getFunctionCalendarLnks: createGetFunctionCalendarLinks(),
  creditCardInfo: createCreditCardAPI(),
  getDealInfo: createGetDealInfo(),
  postMessage: createPostMessage(),
  postFile: createPostFile(),
  postForumComment: createPostForumComment(),
  postFunctionQuestion: createPostFunctionQuestion(),
  postDeclineFunction: createPostDeclineFunction(),
  postBookTickets: createPostBookTickets(),
  postRateDeal: createPostRateDeal(),
  postRedeemDeal: createPostRedeemDeal(),
  getForumPosts: createGetForumPosts(),
  putEditComment: createPutEditComment(),
  deleteComment: createDeleteComment(),
  getMembersObjectives: createGetMembersObjectives(),
  getAllMembers: createGetAllMembers(),
  getMemberExpertise: createGetMemberExpertise(),
  getMembersPageFeeds: createGetMembersPageFeeds(),
  getInvestorsPageFeeds: createGetInvestorsPageFeeds(),
  getInvestorOverview: createInvestorOverview(),
  getPartnersPageFeeds: createGetPartnersPageFeeds(),
  putObjectives: createPutObjectives(),
  putFollowMute: createPutFollowMute(),
  getDeals: createGetDeals(),
  getMembershipPlan: createMembershipPlan(),
  getUserProfileIntroductions: createGetUserProfileIntroductions(),
  getUserProfileAllUpdates: createGetUserProfileAllUpdates(),
  getUserProfile: createGetUserProfile(),
  getSettingsGeneralData: createGetSettingsGeneralData(),
  putSettingsGeneralData: createPutSettingsGeneralData(),
  getSettingsProfileData: createGetSettingsProfileData(),
  putSettingsProfileData: createPutSettingsProfileData(),
  getSettinsProfileNominatorOptions: createGetSettingsProfileNominatorOptions(),
  getUpgradePlan: createMembershipUpgradePlan(),
  postUpgradePlan: updateMembershipUpgradePlan(),
  getForumDetails: createGetForumDetail(),
  getSuggestedPosts: createGetSuggestedPosts(),
  postRemoveSuggestedPosts: createPostRemoveSuggestedPosts(),
  postCreateForumPost: createPostCreateForumPost(),
  getFunctionDetails: createGetFuntionsDetails(),
  investmentSettings: createInvestmentSettingsAPI(),
  getIntroFormInfo: createGetIntroFormInfo(),
  getIntroUserDetails: createGetIntroUserDetails(),
  postUploadImage: createPostUploadImage(),
  postIntroUserDetails: createPostIntroUserDetails(),
  getGroupsPageFeeds: createGetGroupsPageFeeds(),
  postJoinGroup: createPostJoinGroup(),
  postRequestGroupInvite: createPostRequestInviteGroup(),
  getSettingsProfileExpertiseOptions:
    createGetSettingsProfileExpertiseOptions(),
  getSettingsProfileChapterOptions: createGetSettingsProfileChapterOptions(),
  getSettingsCompanySectorsOptions: createGetSettingsCompanySectorsOptions(),
  getSettingsCompanyAcceleratorOptions:
    createGetSettingsCompanyAcceleratorOptions(),
  getSettingsCompanyInvestmentsOptions:
    createGetSettingsCompanyInvestmentsOptions(),
  getSettingsCompanyData: createGetSettingsCompanyData(),
  putSettingsCompanyData: createPutSettingsCompanyData(),
  updateUserOnboardingStatus: updateUserOnboardingStatus(),
  postEditForumPost: createPostEditForumPost(),
  postFollowPost: createPostFollowPost(),
  putMuteForumPost: createPutMuteForumPost(),
  deleteForumPost: createDeleteForumPost(),
  downloadCalendar: createDownloadCalendar(),
  getIntroRequestsCount: createGetIntroRequestsCount(),
  postIntroRequest: createPostIntroRequest(),
  getInvestorDetails: createInvestorDetails(),
  fundraisingInfoAPI: createFundraisingInfoAPI(),
  postRemoveTickets: createPostRemoveTickets(),
  getDealsListingFee: createDealsListingFee(),
  postAddDeal: createAddDeal(),
  getAllDealTags: createDealTags(),
  getGroupDetails: createGetGroupDetails(),
  getMentionData: createGetMentionData(),
  postSiteFeedback: createPostSiteFeedback(),
  getSearchLibrary: createGetSearchLibrary(),
  getApplicationFormTags: createGetApplicationFormTags(),
  getTestimonials: createGetTestimonials(),
  postApplicationForm: createPostApplicationForm(),
  getSectors: createGetSectors(),
  getPaymentPlans: createGetPaymentPlans(),
  getProfileIdData: createGetProfileIdData(),
  getLibraryTags: createGetLibraryTags(),
  getLibraryItem: createGetLibraryItem(),
  deleteLibraryItem: createLibraryDeleteAPI(),
  updateLibraryItem: createLibraryUpdateAPI(),
  getHelpCenterTags: createGetHelpCenterTags(),
  getSiteFeedback: createGetSiteFeedback(),
  downloadFile: createDownloadFromLink(),
  getFunctionRSVP: createGetFunctionRSVP(),
  getFunctionDeclineReasons: createGetFunctionDeclineReasons(),
  postFunctionEmailListing: createPostFunctionEmailListing(),
  getFunctionRSVPList: createGetFunctionRSVPList(),
  postNewFunction: createPostNewFunction(),
  saveFunctionDraft: createSaveFunctionDraft(),
  getAdminFunctionTags: createGetAdminFunctionTags(),
  getAllMembersList: createGetAllMembersList(),
  postFunctionManageRSVP: createPostFunctionManageRSVP(),
  postFunctionRemoveMember: createPostFunctionRemoveMember(),
  postFunctionAddRSVP: createPostFunctionAddRSVP()
};

export {createAPI};
export default apis;
