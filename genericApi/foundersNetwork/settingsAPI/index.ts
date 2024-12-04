import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {NO_DATA_FOUND} from '@/genericApi/constants';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {processOutput} from '@/genericApi/helper';
import {PARTNER_ROLES, REPOSITORIES} from '@/utils/common/constants';

// General Tab ===================

function denormalizeSettingsGETGeneralDataOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            generalSettings: {
              generalData: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsGeneralData() {
  return function getSettingsGeneralData(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/general`);
    requestObj.processOutput = denormalizeSettingsGETGeneralDataOutput;
    return requestObj;
  };
}

function denormalizeSettingsPUTGeneralDataOutput(
  this: RequestObject,
  response: any,
  state: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  const profileId = this?.payload?.profileId;
  const isPartner = PARTNER_ROLES.includes(
    state[REPOSITORIES.PROFILE_REPOSITORY]?.profileData?.[profileId]?.role
  );

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            generalSettings: {
              generalData: res.data
            }
          }
        },
        [isPartner
          ? REPOSITORIES.PARTNERS_REPOSITORY
          : REPOSITORIES.MEMBERS_REPOSITORY]: {
          [isPartner ? 'partners' : 'posts']: {
            [profileId]: {
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              email: res.data.email,
              phone: res.data.phoneNo
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createPutSettingsGeneralData() {
  return function putSettingsGeneralData({
    profileId
  }: {
    profileId: number | string;
  }) {
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/general`);
    requestObj.processOutput = denormalizeSettingsPUTGeneralDataOutput;
    return requestObj;
  };
}

// Company Tab ===================

function denormalizeSettingsCompanySectorsOptionsOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            companySettings: {
              sectorsOptions: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsCompanySectorsOptions() {
  return function getSettingsCompanySectorsOptions(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/sectors`);
    requestObj.processOutput = denormalizeSettingsCompanySectorsOptionsOutput;
    return requestObj;
  };
}

function denormalizeSettingsCompanyInvestmentsOptionsOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            companySettings: {
              investmentsOptions: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsCompanyInvestmentsOptions() {
  return function getSettingsCompanyInvestmentsOptions(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${profileId}/investment-sectors`
    );
    requestObj.processOutput =
      denormalizeSettingsCompanyInvestmentsOptionsOutput;
    return requestObj;
  };
}

function denormalizeSettingsCompanyDataOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            companySettings: {
              companyData: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsCompanyData() {
  return function getSettingsCompanyData(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/company`);
    requestObj.processOutput = denormalizeSettingsCompanyDataOutput;
    return requestObj;
  };
}

function denormalizeSettingsPUTCompanyDataOutput(
  this: RequestObject,
  response: any,
  state: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  const profileId = this?.payload?.profileId;
  const isPartner = PARTNER_ROLES.includes(
    state[REPOSITORIES.PROFILE_REPOSITORY]?.profileData?.[profileId]?.role
  );

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            companySettings: {
              companyData: res.data
            }
          }
        },
        [isPartner
          ? REPOSITORIES.PARTNERS_REPOSITORY
          : REPOSITORIES.MEMBERS_REPOSITORY]: {
          [isPartner ? 'partners' : 'posts']: {
            [profileId]: {
              pitchDeck: res.data.pitchDeckUrl,
              companyName: res.data.companyName,
              company: {
                url: res.data.companyLogoUrl,
                shortDescription: res.data.companyDescription
              }
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createPutSettingsCompanyData() {
  return function putSettingsCompanyData(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/company`);
    requestObj.processOutput = denormalizeSettingsPUTCompanyDataOutput;
    return requestObj;
  };
}

function denormalizeSettingsCompanyAcceleratorOptionsOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            companySettings: {
              acceleratorOptions: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsCompanyAcceleratorOptions() {
  return function getSettingsCompanyAcceleratorOptions(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${profileId}/accelerator`
    );
    requestObj.processOutput =
      denormalizeSettingsCompanyAcceleratorOptionsOutput;
    return requestObj;
  };
}

// Profile Tab ===================

function denormalizeSettingsProfileDataOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            profileSettings: {
              profileData: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsProfileData() {
  return function getSettingsProfileData(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/profile`);
    requestObj.processOutput = denormalizeSettingsProfileDataOutput;
    return requestObj;
  };
}

function denormalizeSettingsPUTProfileDataOutput(
  this: RequestObject,
  response: any,
  state: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  const profileId = this?.payload?.profileId;
  const isPartner = PARTNER_ROLES.includes(
    state[REPOSITORIES.PROFILE_REPOSITORY]?.profileData?.[profileId]?.role
  );

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            profileSettings: {
              profileData: res.data
            }
          },
          userInfo: {
            title: res.data.title
          }
        },
        [isPartner
          ? REPOSITORIES.PARTNERS_REPOSITORY
          : REPOSITORIES.MEMBERS_REPOSITORY]: {
          [isPartner ? 'partners' : 'posts']: {
            [profileId]: {
              background: res.data.background,
              chapter: res.data.homeRegion,
              socialLinks: {
                linkedin: res.data.socialInfo.linkedinUsername,
                twitter: res.data.socialInfo.twitterUsername,
                website: res.data.socialInfo.website
              },
              avatarUrl: res.data.profileImageUrl,
              noteableFoundersStats: [
                {
                  name: 'Startups',
                  value: res.data.careerStats.startupExeperience
                },
                {
                  name: 'Value of Exits',
                  value: res.data.careerStats.successfulExits
                },
                {
                  name: 'Employee Hired',
                  value: res.data.careerStats.employeesHired
                },
                {
                  name: 'Capital Raised',
                  value: res.data.careerStats.lifetimeFundingRaised
                }
              ]
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createPutSettingsProfileData() {
  return function putSettingsProfileData(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/profile`);
    requestObj.processOutput = denormalizeSettingsPUTProfileDataOutput;
    return requestObj;
  };
}

function denormalizeSettingsProfileExpertiseOptionsOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            profileSettings: {
              expertiseOptions: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsProfileExpertiseOptions() {
  return function getSettingsProfileExpertiseOptions(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/exprtise`);
    requestObj.processOutput = denormalizeSettingsProfileExpertiseOptionsOutput;
    return requestObj;
  };
}

function denormalizeSettingsProfileChapterOptionsOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            profileSettings: {
              chapterOptions: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsProfileChapterOptions() {
  return function getSettingsProfileChapterOptions(payload: {
    profileId: string | number;
  }) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(`/v1/api/users/${profileId}/location`);
    requestObj.processOutput = denormalizeSettingsProfileChapterOptionsOutput;
    return requestObj;
  };
}
function denormalizeSettingsProfileNominatorOptionsOutput(
  this: RequestObject,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            profileSettings: {
              nominatorOptions: res.data
            }
          }
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createGetSettingsProfileNominatorOptions() {
  return function getSettingsProfileChapterOptions(payload: {
    userId: string | number;
  }) {
    const {userId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/objectives/all-members`
    );
    requestObj.processOutput = denormalizeSettingsProfileNominatorOptionsOutput;
    return requestObj;
  };
}
