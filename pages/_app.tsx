import '../styles/globals.scss';
import type {AppProps} from 'next/app';
import {store} from '../store';
import {Provider} from 'react-redux';
import React, {useEffect, useRef, useState} from 'react';
import {SessionProvider} from 'next-auth/react';
import Layout from '@/components/Layout';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import RefreshTokenHandler from '@/components/Common/refreshTokenHandler';
import {ModalProvider} from '@/components/ContextProviders/ModalContext';
import mixpanel from 'mixpanel-browser';
import ChatPopupController from '@/components/ChatPopup/ChatPopupController';
import {WebSocketProvider} from '@/context/websocketProvider';

const cacheTime =
  process.env.NEXT_PUBLIC_QUERY_CACHE_TIME &&
  parseInt(process.env.NEXT_PUBLIC_QUERY_CACHE_TIME);

const staleTime =
  process.env.NEXT_PUBLIC_QUERY_STALE_TIME &&
  parseInt(process.env.NEXT_PUBLIC_QUERY_STALE_TIME);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: cacheTime || 300000,
      staleTime: staleTime || 120000,
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false
    }
  }
});

export default function App({
  Component,
  pageProps: {session, ...pageProps}
}: AppProps) {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN ?? '');
    mixpanel.track('Page View', {page: 'Page Name'});
  }

  const [interval, setInterval] = useState(0);
  const cachePreloaded = useRef(false);

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

  const wsUrl = 'wss://staging.foundersnetwork.com/ws/notifications/';

  return (
    <main>
      <SessionProvider session={session} refetchInterval={interval}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ModalProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              <WebSocketProvider url={wsUrl}>
                <Layout cachePreloaded={cachePreloaded}>
                  <Component {...pageProps} />
                  <RefreshTokenHandler setInterval={setInterval} />
                  <ChatPopupController />
                </Layout>
              </WebSocketProvider>
            </ModalProvider>
          </QueryClientProvider>
        </Provider>
      </SessionProvider>
    </main>
  );
}
