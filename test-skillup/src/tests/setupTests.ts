import '@testing-library/jest-dom';
import { loadEnvConfig } from '@next/env';
import { Headers, Request, Response, fetch } from 'cross-fetch';

import { server } from './setupServer';

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

jest.mock('next/router', () => ({
  useRouter() {
    return {
      basePath: '',
      pathname: '/',
      route: '/',
      asPath: '/',
      query: {},
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(() => ({ catch: jest.fn() })),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: false,
    };
  },
}));

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:3000',
    CDN_URL: 'localhost:8080',
  },
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// eslint-disable-next-line no-console
loadEnvConfig(process.cwd(), true, { info: () => null, error: console.error });
