import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {NO_DATA_FOUND} from '@/genericApi/constants';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {processOutput} from '@/genericApi/helper';
import {
  MINI_PROFILE_API_MEMBER_MAP,
  MINI_PROFILE_API_PARTNER_MAP,
  PROFILE_API_MEMBER_MAP,
  PROFILE_API_PARTNER_MAP
} from '@/utils/common/apiToStoreMaps';
import {PARTNER_ROLES, REPOSITORIES} from '@/utils/common/constants';
import {convertObjectUsingMapping} from '@/utils/common/helper';

export function createGetUserProfileIntroductions() {
  function denormalizeUserProfileIntroductionsOutput(
    this: RequestObject,
    response: any
  ) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res && res.data) {
      if (Object.keys(res.data).length) {
        return {
          [REPOSITORIES.PROFILE_REPOSITORY]: {
            introductions: res.data
          }
        };
      } else throw new NoDataFoundError(NO_DATA_FOUND);
    }

    return res;
  }

  return function getUserProfileIntroductions(payload: {
    userId: string | number;
  }) {
    const {userId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/request-introductions`
    );
    requestObj.processOutput = denormalizeUserProfileIntroductionsOutput;
    return requestObj;
  };
}

export function createGetUserProfileAllUpdates() {
  function denormalizeUserProfileAllUpdatesOutput(
    this: RequestObject,
    response: any
  ) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res && res.data) {
      if (Object.keys(res.data).length) {
        return {
          [REPOSITORIES.PROFILE_REPOSITORY]: {
            allUpdates: res.data
          }
        };
      } else throw new NoDataFoundError(NO_DATA_FOUND);
    }

    return res;
  }

  return function getUserProfile(payload: {userId: string | number}) {
    const {userId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${userId}/all-updates`);
    requestObj.processOutput = denormalizeUserProfileAllUpdatesOutput;
    return requestObj;
  };
}

const getProfileMap = (isPartner: boolean, isMiniProfile: boolean) => {
  if (isPartner) {
    return isMiniProfile
      ? MINI_PROFILE_API_PARTNER_MAP
      : PROFILE_API_PARTNER_MAP;
  }

  return isMiniProfile ? MINI_PROFILE_API_MEMBER_MAP : PROFILE_API_MEMBER_MAP;
};

function denormalizeUserProfileDataOutput(
  this: RequestObject,
  isMiniProfile: boolean,
  response: any,
  state: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  const profileId = this?.payload?.profileId;
  const isPartner = PARTNER_ROLES.includes(res.data.role);

  if (Object.keys(res?.data || {}).length) {
    const stateProfileData =
      state[REPOSITORIES.PROFILE_REPOSITORY]?.profileData?.[profileId];

    return {
      [isPartner
        ? REPOSITORIES.PARTNERS_REPOSITORY
        : REPOSITORIES.MEMBERS_REPOSITORY]: {
        [isPartner ? 'partners' : 'posts']: {
          [profileId]: convertObjectUsingMapping(
            res.data,
            getProfileMap(isPartner, isMiniProfile)
          )
        }
      },
      [REPOSITORIES.PROFILE_REPOSITORY]: {
        profileData: {
          [profileId]: {
            role: res.data.role || stateProfileData?.role,
            isProfileAvailable:
              !isMiniProfile || (stateProfileData?.isProfileAvailable ?? false),
            isMiniProfileAvailable:
              isMiniProfile ||
              (stateProfileData?.isMiniProfileAvailable ?? false)
          }
        }
      }
    };
  }

  return res;
}

export function createGetUserProfile() {
  return function createGetUserProfile(payload: {profileId: string | number}) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}`);
    requestObj.processOutput = denormalizeUserProfileDataOutput.bind(
      requestObj,
      false
    );
    return requestObj;
  };
}

export function createGetMiniProfile() {
  return function getMiniProfile(payload: {profileId: number}) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${profileId}/mini-profile`
    );
    requestObj.processOutput = denormalizeUserProfileDataOutput.bind(
      requestObj,
      true
    );
    return requestObj;
  };
}

export function updateUserOnboardingStatus() {
  return function (payload: {userId: number}) {
    const {userId} = payload;
    return createAPI(false)(`/v1/api/users/${userId}/onboarding`);
  };
}

export function createGetCompanyProfile() {
  return function (payload: {profileId: number}) {
    const {profileId} = payload;
    return createAPI(false)(`/v1/api/users/${profileId}/company`);
  };
}

export function createPostIntroRequest() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      return this.payload?.isPartner
        ? {
            [REPOSITORIES.PARTNERS_REPOSITORY]: {
              partners: {
                [this.payload?.profileId ?? '']: {
                  introRequested: true
                }
              }
            }
          }
        : {
            [REPOSITORIES.MEMBERS_REPOSITORY]: {
              posts: {
                [this.payload?.profileId ?? '']: {
                  introRequested: true
                }
              }
            }
          };
    }

    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {userId, profileId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/profile/${profileId}/request-intro`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostSiteFeedback() {
  return function (payload: {userId: number}) {
    const {userId} = payload;
    return createAPI(false)(`/v1/api/users/${userId}/site-feedback`);
  };
}
