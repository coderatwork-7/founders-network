import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {createAPI} from '../apiEndpoints';
import {AxiosResponse} from 'axios';
import {processOutput} from '@/genericApi/helper';
import {isError} from '@tanstack/react-query';

function denormalizeToReactInputForm(
  this: RequestObject,
  response: AxiosResponse
) {
  const res = processOutput(response);
  if (!res.errorCode) {
    return {
      data: res?.data?.map?.((e: {id: number; name: string}) => ({
        label: e.name,
        value: e.id
      }))
    };
  }
  return res;
}
export function createGetApplicationFormTags() {
  return function getApplicationFormTags() {
    const requestObj = createAPI(false)('/v1/api/apply-form/tags');
    requestObj.processOutput = denormalizeToReactInputForm;
    return requestObj;
  };
}
function denormalizeToData(this: RequestObject, response: AxiosResponse) {
  const res = processOutput(response);
  if (!res.errorCode) {
    return {
      data: res?.data
    };
  }
  return {
    error:
      (response as any)?.response?.data?.errors ??
      (response as any)?.response?.data?.error,
    status: (response as any)?.response?.status,
    message: (response as any)?.response?.message
  };
}
export function createGetTestimonials() {
  return function getTestimonials() {
    const requestObj = createAPI(false)('v1/api/apply-form/testimonials');
    requestObj.processOutput = denormalizeToData;
    return requestObj;
  };
}

function denormalizeError(this: RequestObject, response: AxiosResponse) {
  if (isError(response)) {
    return {
      error:
        (response as any)?.response?.data?.errors ??
        (response as any)?.response?.data?.error,
      status: (response as any)?.response?.status,
      message: (response as any)?.response?.message
    };
  }
  return response;
}
export function createPostApplicationForm() {
  return function postApplicationForm() {
    // const {query} = makeUrlVariables([], ['profileId'], {profileId});
    const requestObj = createAPI(false)(
      `/v1/api/submit-application-new-element`
    );
    requestObj.processOutput = denormalizeError;
    return requestObj;
  };
}

// export function createPostApplicationForm(){
//   return function postApplicationForm(){
//      const requestObj = createAPI(false)('/v1/api/submit-application/' ) ;
//     requestObj.processOutput = denormalizeError;
//     return requestObj;
//   }
// }

export function createGetSectors() {
  return function getSectors({type}: {type: string}) {
    const requestObj = createAPI(false)(`/v1/api/${type}`);
    requestObj.processOutput = denormalizeToReactInputForm;
    return requestObj;
  };
}

export function createGetPaymentPlans() {
  return function getPaymentPlans() {
    const requestObj = createAPI(false)('/v1/api/stage-payment-plan');
    requestObj.processOutput = denormalizeToData;
    return requestObj;
  };
}

export function createGetProfileIdData() {
  return function getProfileIdData({profileId}: {profileId: string}) {
    const requestObj = createAPI(false)(`/v1/api/apply-form/${profileId}`);
    requestObj.processOutput = denormalizeToData;
    return requestObj;
  };
}
