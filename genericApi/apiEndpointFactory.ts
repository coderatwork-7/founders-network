import {processInput, processOutput} from './helper';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

export interface RequestObject {
  additionalParameter?: {key?: string; [key: string]: any};
  url: string;
  client: AxiosInstance;
  options?: AxiosRequestConfig;
  payload?: {[key: string]: any};
  // eslint-disable-next-line no-unused-vars
  processInput: (request: RequestObject, state?: object) => RequestObject;
  processOutput: (
    // eslint-disable-next-line no-unused-vars
    response: any,
    // eslint-disable-next-line no-unused-vars
    state?: object
  ) => any;
}

/**
 * Initializes a new API Endpoint and returns request object.
 * @param baseURL Base URL for API.
 * @returns createAPI function which returns a new Request Object.
 */
function createApiEndpoint(baseURL: string): (
  // eslint-disable-next-line no-unused-vars
  url: string,
  // eslint-disable-next-line no-unused-vars
  options?: AxiosRequestConfig
) => RequestObject {
  const client = axios.create({
    baseURL
  });

  return function createApi(
    url: string,
    options: AxiosRequestConfig = {
      method: 'GET'
    }
  ): RequestObject {
    return {
      url,
      options,
      client,
      processInput,
      processOutput
    };
  };
}

export default createApiEndpoint;
