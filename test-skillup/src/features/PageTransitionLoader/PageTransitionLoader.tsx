import { HRSpinner } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import { PageTransitionLoaderContext } from 'src/contexts/PageTransitionLoaderContext';
import { logger } from 'src/utils/logger';

export function PageTransitionLoader({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const { pageLoading, setPageLoading } = useContext(PageTransitionLoaderContext);

  useEffect(() => {
    function handleComplete() {
      setPageLoading(false);
    }

    function handleError(error) {
      logger.error({
        message: 'Error on route change',
        error,
      });
      handleComplete();
    }

    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  });

  if (pageLoading) {
    return (
      <div className="hr-flex hr-grow hr-align-center hr-justify-center">
        <HRSpinner />
      </div>
    );
  }

  // ts throws errors if no fragment
  // eslint-disable-next-line
  return <>{children}</>;
}
