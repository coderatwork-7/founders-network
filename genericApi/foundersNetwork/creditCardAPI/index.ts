import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {REPOSITORIES} from '@/utils/common/constants';

export function createCreditCardAPI() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            creditCard: {
              number: res.data.number,
              expiration: res.data.expiration,
              firstName: res.data.firstName,
              lastName: res.data.lastName
            }
          }
        }
      };
    }
    return res;
  }
  return function creditCardAPI(payload: InvokeApiClientSidePayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(`/v1/api/users/${userId}/credit-card`);
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
