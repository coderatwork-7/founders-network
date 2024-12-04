import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {processOutput} from '@/genericApi/helper';
import {downloadBlob} from '@/utils/common/helper';

export const FILE_UPLOAD_URL = `/v1/api/fileupload`;

export function createPostFile() {
  return function postFile() {
    return createAPI(false)(`/v1/api/fileupload`);
  };
}

export function createDownloadFromLink() {
  function processDownload(this: RequestObject, response: any) {
    const res = processOutput(response);

    if (res?.data) {
      return downloadBlob(
        res.data,
        this.payload?.fileName ?? `FN-${new Date().toLocaleDateString()}`
      );
    }
    return res;
  }

  return function ({href}: InvokeApiClientSidePayload) {
    const requestObj = createAPI(false)(href);
    requestObj.processOutput = processDownload;
    return requestObj;
  };
}
