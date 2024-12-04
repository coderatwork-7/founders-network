import {AnyAction} from 'redux';
import {InvokeApiFunction} from '.';
import {Dispatch} from 'react';
import {MiddlewareAPI} from '@reduxjs/toolkit';
import * as subscribers from './subscribers';

// eslint-disable-next-line no-unused-vars
export type Listener = (action: AnyAction) => void;
// eslint-disable-next-line no-unused-vars
export type Subscribe = (listener: Listener) => () => void;

export type DefaultSubscriber = {
  subscribe: Subscribe;
  getState?: any;
  invokeApi?: InvokeApiFunction;
};

export const createSubscribeMiddleware = () => {
  const listeners = new Set<Listener>();

  const subscribe: Subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  Object.values(subscribers).forEach(subscriber => {
    subscriber({subscribe});
  });

  const subscriberMiddleware =
    (
      store: MiddlewareAPI // eslint-disable-line no-unused-vars
    ) =>
    (next: Dispatch<AnyAction>) =>
    (action: AnyAction) => {
      listeners.forEach(listener => listener(action));
      return next(action);
    };

  return {subscriberMiddleware};
};
