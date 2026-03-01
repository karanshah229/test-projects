import { createContext, useMemo, useState } from 'react';

type PageTransitionLoaderContextType = {
  pageLoading: boolean;
  setPageLoading: Function;
};

export const PageTransitionLoaderContext = createContext<PageTransitionLoaderContextType>({
  pageLoading: false,
  setPageLoading: () => {},
});

export function PageTransitionLoaderProvider({ children }: { children: React.ReactNode }) {
  const [pageLoading, setPageLoading] = useState(false);

  const contextVal = useMemo(
    () => ({ pageLoading, setPageLoading }),
    [pageLoading, setPageLoading],
  );

  return (
    <PageTransitionLoaderContext.Provider value={contextVal}>
      {children}
    </PageTransitionLoaderContext.Provider>
  );
}
