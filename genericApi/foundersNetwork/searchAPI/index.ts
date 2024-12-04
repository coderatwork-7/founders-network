import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {NoDataFoundError} from '@/genericApi/errors';
import {FEEDS_TYPE, REPOSITORIES} from '@/utils/common/constants';
import {convertObjectUsingMapping, prefixIdByType} from '@/utils/common/helper';
import {DEALS_PAGE_MAP} from '@/utils/common/apiToStoreMaps';

const RESULT_TYPES: {
  [key: string]: {
    repoName: string;
    objName: string;
    feedType: FEEDS_TYPE;
    modifyResult?: (result: any) => any; // eslint-disable-line no-unused-vars
    processRepoObj?: (result: any) => any; // eslint-disable-line no-unused-vars
    processDataObj?: (result: any) => any; // eslint-disable-line no-unused-vars
  };
} = {
  forum: {
    repoName: REPOSITORIES.FEEDS_REPOSITORY,
    objName: 'forums',
    feedType: FEEDS_TYPE.FORUMS,
    modifyResult: result => ({
      ...result,
      id: prefixIdByType(result.id, FEEDS_TYPE.FORUMS)
    })
  },
  partners: {
    repoName: REPOSITORIES.PARTNERS_REPOSITORY,
    objName: 'partners',
    feedType: FEEDS_TYPE.PARTNERS
  },
  members: {
    repoName: REPOSITORIES.MEMBERS_REPOSITORY,
    objName: 'posts',
    feedType: FEEDS_TYPE.MEMBERS
  },
  functions: {
    repoName: REPOSITORIES.FUNCTIONS_REPOSITORY,
    objName: 'functions',
    feedType: FEEDS_TYPE.FUNCTIONS
  },
  deals: {
    repoName: REPOSITORIES.DEALS_REPOSITORY,
    objName: 'deals',
    feedType: FEEDS_TYPE.DEALS,
    processRepoObj: (result: any) =>
      convertObjectUsingMapping(result, DEALS_PAGE_MAP),
    processDataObj: (result: any) => result.id
  }
};

interface GetSearchPayload {
  searchTerm: string;
}

export function createGetSearchSuggestions() {
  return function getSearchSuggestions(payload: GetSearchPayload) {
    const {searchTerm} = makeUrlVariables(['searchTerm'], [], payload);
    return createAPI(false)(`/v1/api/search/typeahead?term=${searchTerm}`);
  };
}

export function createGetSearchResults() {
  function denormalizeUserProfileSettingsGeneralOutput(
    this: RequestObject,
    response: any
  ) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);
    const repoUpdates = {} as any;
    const data = {} as any;

    if (res?.data) {
      Object.keys(res.data).forEach(resultType => {
        const {
          repoName,
          objName,
          feedType,
          modifyResult,
          processRepoObj,
          processDataObj
        } = RESULT_TYPES[resultType];

        const searchObj = res.data[resultType];
        const repoObject = {} as any;
        const ids = [] as any[];
        searchObj.results.forEach((res: any) => {
          const result = modifyResult?.(res) ?? res;
          repoObject[result.id] = processRepoObj?.(result) ?? result;
          ids.push(processDataObj?.(result) ?? result.id);
        });
        repoUpdates[repoName] = {[objName]: repoObject};
        data[feedType] = {ids, count: searchObj.count};
      });

      return {
        ...repoUpdates,
        data
      };
    }

    return res;
  }

  return function (payload: GetSearchPayload) {
    const {query} = makeUrlVariables([], ['q'], payload);
    const requestObj = createAPI(false)(`/v1/api/search${query}`);
    requestObj.processOutput = denormalizeUserProfileSettingsGeneralOutput;
    return requestObj;
  };
}
