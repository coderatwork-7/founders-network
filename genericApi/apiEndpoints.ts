import foundersApis from './foundersNetwork/apiEndpoints';
import {ConcurrentApiNotAllowed} from './errors';
import {
  API_INITIATED,
  API_SUCCEEDED,
  API_ERRORED,
  PENDING,
  RESOLVED,
  REJECTED,
  COMPLETED
} from './constants';
import {RequestObject} from './apiEndpointFactory';
import {AxiosRequestConfig, AxiosResponse, CanceledError} from 'axios';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {RootState} from '@/store';

export const CONCURRENCY_CONTROL: any = {
  takeFirstRequest: 'takeFirstRequest',
  takeLastRequest: 'takeLastRequest',
  takeAllRequest: 'takeAllRequest'
};

export type InvokeApiClientSidePayload = {
  concurrencyControl?: keyof typeof CONCURRENCY_CONTROL;
  isReduxSkipped?: boolean;
  [key: string]: any;
};

const allApis: any = {
  ...foundersApis
};

interface CacheEntry {
  [key: string]: {ongoing: boolean; controller?: AbortController};
}

const cache: CacheEntry = {};

/**
 * Invokes API call and returns the response.
 * @param requestObj Request Object
 * @param state State
 * @returns Response of API call
 */
const invokeApi = async function invokeApi(
  requestObj: RequestObject,
  getState: any
): Promise<AxiosResponse<any, any>> {
  if (requestObj.processInput) requestObj.processInput(getState());

  try {
    const response: AxiosResponse<any, any> = await requestObj.client.request({
      url: requestObj.url,
      ...requestObj.options
    });
    if ([200, 201].includes(response.status)) {
      if (requestObj.processOutput)
        return requestObj.processOutput(response, getState());
      else return response;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    let e = error;
    if (!(e instanceof CanceledError) && requestObj.processOutput) {
      e = requestObj.processOutput(error, getState());
    }

    throw e;
  }
};

/**
 * Function to invode client side API call.
 * @param name API name
 * @param payload API Payload
 * @param options API Endpoint Options. For eg: headers, data, etc.
 * @param resolve Promise.resolve
 * @param reject Promise.reject
 * @returns An async function which dispatches action and finally returns response & stores in Redux store.
 */
function invokeApiClientSide(
  name: string,
  payload: InvokeApiClientSidePayload,
  options: AxiosRequestConfig,
  // eslint-disable-next-line no-unused-vars
  resolve: (value: object | PromiseLike<object>) => void,
  // eslint-disable-next-line no-unused-vars
  reject: (reason: object) => void
): any {
  return async function (
    dispatch: ThunkDispatch<RootState, undefined, AnyAction>,
    getState: any
  ) {
    const api = allApis[name];
    cache[name] = cache[name] ?? {ongoing: false, controller: undefined};

    if (
      payload?.concurrencyControl === CONCURRENCY_CONTROL.takeFirstRequest &&
      cache[name].ongoing === true
    ) {
      reject({
        isError: true,
        errorObj: new ConcurrentApiNotAllowed('ConcurrentApiNotAllowed'),
        errorCode: '',
        errorMessage: 'ConcurrentApiNotAllowed'
      });
      return false;
    }
    cache[name].ongoing = true;
    const requestObj = api(payload);
    requestObj.payload = payload;
    requestObj.options = {...requestObj.options, ...options};

    if (payload?.concurrencyControl === CONCURRENCY_CONTROL.takeLastRequest) {
      cache[name].controller?.abort();
      const abort = new AbortController();
      cache[name].controller = abort;
      requestObj.options.signal = abort.signal;
    }

    const action: AnyAction = {
      type: API_INITIATED,
      apiName: name,
      payload,
      currentState: getState(),
      isReduxSkipped: payload.isReduxSkipped || false
    };

    dispatch(action);

    action.type = name + PENDING;
    action.currentState = getState();
    dispatch(action);

    let cancelled = false;
    try {
      const response = await invokeApi(requestObj, getState);

      action.response = response;
      action.type = API_SUCCEEDED;
      action.currentState = getState();
      dispatch(action);

      action.type = name + RESOLVED;
      action.currentState = getState();
      dispatch(action);

      resolve({isError: false, data: response?.data});
    } catch (error) {
      if (error instanceof CanceledError) {
        cancelled = true;
      } else {
        action.response = error;
        action.type = API_ERRORED;
        action.currentState = getState();
        dispatch(action);

        action.type = name + REJECTED;
        action.currentState = getState();
        dispatch(action);
      }

      reject({...action.response, errorObj: error, isError: true});
    } finally {
      if (!cancelled) {
        action.type = name + COMPLETED;
        action.currentState = getState();
        dispatch(action);

        cache[name] = {...cache[name], ongoing: false};
      }
    }
  };
}

export default {
  ...allApis
};

export {invokeApi, invokeApiClientSide};
