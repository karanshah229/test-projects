import { NextPageContext } from 'next';
import NextErrorComponent, { ErrorProps as NextErrorProps } from 'next/error';

import { ErrorMessage } from 'src/components/ErrorMessage';

type ErrorPageProps = {
  err: Error;
  hasGetInitialPropsRun: boolean;
};

type ErrorProps = {
  hasGetInitialPropsRun: boolean;
} & NextErrorProps;

function noticeError(err) {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
    const newrelic = require('newrelic');
    newrelic.noticeError(err);
  } else {
    (window as any).newrelic.noticeError(err);
  }
}

function MyError({ hasGetInitialPropsRun, err }: ErrorPageProps) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    noticeError(err);
    // Flushing is not required in this case as it only happens on the client
  }

  return <ErrorMessage />;
}

MyError.getInitialProps = async (context: NextPageContext) => {
  const errorInitialProps = (await NextErrorComponent.getInitialProps(context)) as ErrorProps;

  const { res, err, asPath } = context;

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true;

  // Returning early because we don't want to log 404 errors to Newrelic.
  if (res?.statusCode === 404) {
    return errorInitialProps;
  }

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err) {
    noticeError(err);
    return errorInitialProps;
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Newrelic
  noticeError(
    new Error(
      `Page: _error.page.tsx; Action: getInitialProps missing data at path - ${asPath}; Status code: ${res?.statusCode}`,
    ),
  );
  return errorInitialProps;
};

export default MyError;
