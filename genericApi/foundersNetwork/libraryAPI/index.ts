import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {
  REPOSITORIES,
  LIBRARY_ITEM_TYPES,
  CONST_MARK_REMOVED
} from '@/utils/common/constants';

export function createGetSearchLibrary() {
  return function (payload: InvokeApiClientSidePayload) {
    const {type, query} = makeUrlVariables(['type'], ['q'], payload);
    const endpoint =
      type === LIBRARY_ITEM_TYPES.LIBRARY
        ? `/v1/api/${type}/search${query}`
        : `/v1/api/${type}${query}`;
    return createAPI(false)(endpoint);
  };
}

function denormalizeTagsOutput(
  this: RequestObject,
  type: string,
  response: any
) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res?.data?.length) {
    return {
      [REPOSITORIES.LIBRARY_REPOSITORY]: {
        tags: {
          [type]: res.data.reduce(
            (acc: any, tag: any) =>
              Object.assign(acc, {
                [tag.name]: {label: tag.name, value: tag.id}
              }),
            {}
          )
        }
      }
    };
  }
  return res;
}

export function createGetLibraryTags() {
  return function () {
    const requestObj = createAPI(false)(`/v1/api/library/tags`);
    requestObj.processOutput = denormalizeTagsOutput.bind(
      requestObj,
      LIBRARY_ITEM_TYPES.LIBRARY
    );
    return requestObj;
  };
}

export function createGetHelpCenterTags() {
  return function () {
    const requestObj = createAPI(false)(`/v1/api/help-center/tags`);
    requestObj.processOutput = denormalizeTagsOutput.bind(
      requestObj,
      LIBRARY_ITEM_TYPES.HELP_CENTER
    );
    return requestObj;
  };
}

function denormalizeLibItemOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res?.data?.id) {
    return {
      [REPOSITORIES.LIBRARY_REPOSITORY]: {
        [this.payload?.type]: {
          [res.data.id]: res.data
        }
      }
    };
  }

  return res;
}

export function createLibraryUpdateAPI() {
  return function ({type, id}: InvokeApiClientSidePayload) {
    const requestObj = createAPI(false)(`/v1/api/${type}${id ? '/' + id : ''}`);
    requestObj.processOutput = denormalizeLibItemOutput;
    return requestObj;
  };
}

export function createGetLibraryItem() {
  return function ({type, id}: InvokeApiClientSidePayload) {
    const requestObj = createAPI(false)(`/v1/api/${type}/${id}`);
    requestObj.processOutput = denormalizeLibItemOutput;
    return requestObj;
  };
}

export function createLibraryDeleteAPI() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res?.data) {
      return {
        [REPOSITORIES.LIBRARY_REPOSITORY]: {
          [this.payload?.type]: {
            [this.payload?.id]: {
              [CONST_MARK_REMOVED]: true,
              replaceReduxState: true
            }
          }
        }
      };
    }

    return res;
  }

  return function ({type, id}: InvokeApiClientSidePayload) {
    const requestObj = createAPI(false)(`/v1/api/${type}/${id}`);
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
