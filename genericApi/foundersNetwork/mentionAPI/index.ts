import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {createAPI} from '../apiEndpoints';
import {processOutput} from '@/genericApi/helper';

function denormalizeGetMentionDataOutput(this: RequestObject, response: any) {
  const res = processOutput(response);
  if (!res?.errorCode) {
    return {data: res?.data};
  }
}
export function createGetMentionData() {
  return function getMentionData({
    userId,
    name
  }: {
    userId: number;
    name: string;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/mentions?q=${name}`
    );
    requestObj.processOutput = denormalizeGetMentionDataOutput;
    return requestObj;
  };
}
