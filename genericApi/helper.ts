import updateState from './updateState';
import {API_SUCCEEDED} from './constants';
import {RequestObject} from './apiEndpointFactory';
import {FacetState} from '@/utils/common/commonTypes';

function processInput(request: RequestObject) {
  return request;
}

function isError(response: any) {
  return !response.status || ![200, 201].includes(response.status);
}

function processError(response: any) {
  return {
    errorMessage: response.message,
    errorCode: response.code
  };
}

function processOutput(response: any) {
  if (isError(response)) {
    return processError(response);
  }

  return response;
}

const reduceReducers = (reducers: any) => (initialState: any, action: any) => {
  console.assert(Array.isArray(reducers), 'Array of reducers expected.');

  return reducers.reduce(
    (intermediateState: any, reducer: any) =>
      reducer(intermediateState, action),
    initialState
  );
};

const createStateUpdateReducer =
  (
    repositoryName: string
  ): // eslint-disable-next-line no-unused-vars
  ((state: any, action: any) => any) =>
  (state = {}, action) => {
    if (
      !action.isReduxSkipped &&
      action.response &&
      repositoryName in action.response &&
      action.type === API_SUCCEEDED
    ) {
      return updateState(state, action.response[repositoryName]);
    }
    return state;
  };

const dummyReducer = (state = {}) => {
  return state;
};

function urlVariable(variable: number | string) {
  return `${variable}`;
}

function makeUrlVariables(
  pathParams: string[],
  queryParams: string[],
  parameterPayload: any
) {
  const object: {[key: string]: any} = {};
  pathParams.forEach((key: string) => {
    object[key] = urlVariable(parameterPayload[key]);
  });
  const querySearchParams = new URLSearchParams();
  queryParams.forEach(
    param =>
      parameterPayload[param] != undefined &&
      querySearchParams.set(param, `${parameterPayload[param]}`)
  );
  object.query = `?${querySearchParams.toString()}`;
  return object;
}

function facetStateToPayload(facetState: FacetState, ignore: string[]) {
  const payload: {[key: string]: string} = Object.entries(
    facetState ?? {}
  ).reduce(
    (acc, [facetKey, facetValuesObject]) =>
      Object.keys(facetValuesObject ?? {}).length
        ? Object.assign(acc, {
            [facetKey]: Object.values(facetValuesObject)
              .map(facetValueObject => facetValueObject.facetValueKey)
              .join('|')
          })
        : acc,
    {}
  );
  ignore.forEach(key => delete payload[key]);
  return payload;
}

const checkLoading = (state: any) => state === undefined || state;

export {
  processInput,
  processOutput,
  reduceReducers,
  createStateUpdateReducer,
  dummyReducer,
  makeUrlVariables,
  facetStateToPayload,
  checkLoading
};

export const getCookieValue = (cookieName: string) => {
  const cookie = document.cookie
    .split('; ')
    .find(c => c.startsWith(`${cookieName}=`));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};
