import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {NOMINATIONS_INFINTIE, REPOSITORIES} from '@/utils/common/constants';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {selectNominationInfo} from '@/store/selectors';
import {NoDataFoundError} from '@/genericApi/errors';
import {NO_DATA_FOUND} from '@/genericApi/constants';

interface NominationPayload {
  url: {userId: string | number};
  [key: string]: any;
}
interface FeedbackPayload {
  feedback?: string;
  nominationId?: number;
}

const denormalizeNominationOutput = (response: any) => {
  const res = processOutput(response);
  if (res?.data) {
    return {
      [REPOSITORIES.NOMINATION_REPOSITORY]: {
        nomination: {
          info: {
            ...res.data,
            remainingNominations: res.data.remainingNominations || 0
          }
        }
      }
    };
  }
  return res;
};

export function createGetNominationInfo() {
  return function getNominationInfo(payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/nominations/info`
    );

    requestObj.processOutput = denormalizeNominationOutput;
    return requestObj;
  };
}

export function createGetNominationStatsInfo() {
  return function getNominationStatsInfo(payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/nominations/stats/info`
    );

    requestObj.processOutput = denormalizeNominationOutput;
    return requestObj;
  };
}

export function createGetSavePreferences() {
  return function getSavePreferences(payload: NominationPayload) {
    const {profileId} = makeUrlVariables(['profileId'], [], payload);
    return createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/investor/${profileId}/save_preferences`
    );
  };
}

export function createGetOverViewData() {
  return function OverViewData(payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    return createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/overview`
    );
  };
}

export function createGetSectorData() {
  return function SectorData(payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    return createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/investor/tech-sectors`
    );
  };
}

export function createGetStagesData() {
  return function StagesData(payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    return createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/investor/stages`
    );
  };
}

export function createGetLocation() {
  return function LocationData(payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    return createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/investor/locations`
    );
  };
}

function denormalizeSavePreferenceData(response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        locations: res.data.locations,
        sectors: res.data.sectors,
        stages: res.data.stages,
        ranges: res.data.ranges
      };
    } else {
      throw new NoDataFoundError(NO_DATA_FOUND);
    }
  }

  return res;
}

export function createPutSavePreferences() {
  return function PutSavePreference(payload: {profileId: string | number}) {
    const {profileId} = payload;
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/investor/${profileId}/save_preferences`
    );
    requestObj.processOutput = denormalizeSavePreferenceData;
    return requestObj;
  };
}

function denormalizeOverviewData(response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res && res.data) {
    if (Object.keys(res.data).length) {
      return {
        overview: {
          background: res.data.overview.background,
          insiderInformation: res.data.overview.insiderInformation,
          investmentLocations: res.data.locations,
          sector: res.data.sectors,
          investsIn: res.data.stages,
          investmentRange: res.data.ranges
        },
        socialInfo: {
          linkedinUsername: res.data.socialInfo.linkedinUsername,
          twitterUsername: res.data.socialInfo.twitterUsername,
          angelListUsername: res.data.socialInfo.angelListUsername,
          facebookUsername: res.data.socialInfo.facebookUsername
        }
      };
    } else throw new NoDataFoundError(NO_DATA_FOUND);
  }

  return res;
}

export function createPutOverviewData() {
  return function PutOverviewData(payload: {userId: string | number}) {
    const {userId} = payload;
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/overview`
    );
    requestObj.processOutput = denormalizeOverviewData;
    return requestObj;
  };
}

const getRemainingNominations = (total: number, used: number) => {
  if (total === NOMINATIONS_INFINTIE) return total;
  return total - used;
};

export function createPostNominations() {
  function denormalizeOutput(response: any, state: any) {
    const res = processOutput(response).data;
    const resCount = res?.data?.filter?.((nom: any) => !nom.status.iserror);
    if (resCount.length !== 0) {
      return {
        [REPOSITORIES.NOMINATION_REPOSITORY]: {
          nomination: {
            info: {
              remainingNominations: getRemainingNominations(
                selectNominationInfo()(state)?.remainingNominations,
                resCount.length
              )
            }
          }
        },
        data: res.data
      };
    }
    return res;
  }

  return function postNominations(payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/nominations`
    );

    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostFeedback() {
  return function postFeedback(payload: FeedbackPayload) {
    const {userId, nominationId = '333'} = makeUrlVariables(
      ['userId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/nomination/${nominationId}/feedback`
    );
    requestObj.processOutput = processOutput;
    return requestObj;
  };
}

export function createPostNominationsRequest() {
  function denormalizeOutput(response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.NOMINATION_REPOSITORY]: {
          nomination: {
            info: {
              requestedNomination: true
            }
          }
        }
      };
    }
    return res;
  }

  return function (payload: NominationPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/request-nomination`
    );

    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
