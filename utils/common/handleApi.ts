/* eslint-disable react-hooks/rules-of-hooks */
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {store} from '@/store';
import {AxiosRequestConfig} from 'axios';
import {useCallback} from 'react';
import {useSession} from 'next-auth/react';

function handleApi() {
  const {data: session} = useSession();
  return useCallback(
    (
      name: string,
      payload: InvokeApiClientSidePayload,
      options?: AxiosRequestConfig
    ) => {
      const AuthOptions = {
        ...options
      };
      return store.invokeApi(name, payload, AuthOptions);
    },
    [session]
  );
}

export default handleApi;
