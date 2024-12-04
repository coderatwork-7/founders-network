import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {store} from '@/store';
import {AxiosRequestConfig} from 'axios';
import {useCallback} from 'react';
import {useSession} from 'next-auth/react';

function useAPI() {
  const {data: session} = useSession();
  return useCallback(
    (
      name: string,
      payload: InvokeApiClientSidePayload,
      options?: AxiosRequestConfig
    ) => {
      const AuthOptions = {
        ...options,
        headers: {
          ...options?.headers,
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      };
      return store.invokeApi(name, payload, AuthOptions);
    },
    [session]
  );
}

export default useAPI;
