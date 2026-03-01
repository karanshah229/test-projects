import { useRouter } from 'next/router';
import { createContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { useGetEmployeeesQuery } from 'src/services/Employees';
import { EmployeeListingAPIParams } from 'src/types/api/employees';

import { requestParamsReducer } from '../requestParamsReducer';
import { parseQueryArgs } from '../utils';

type QueryArgsContextType = {
  queryArgs: Partial<EmployeeListingAPIParams>;
  updateQueryArgs: Function;
};

export const QueryArgsContext = createContext<QueryArgsContextType>({
  queryArgs: {} as Partial<EmployeeListingAPIParams>,
  updateQueryArgs: () => {},
});

export function QueryArgsProvider({ children }: { children: React.ReactNode }) {
  const { query } = useRouter();
  const parsedQueryArgs = useRef(parseQueryArgs(query));

  const [queryArgs, updateQueryArgs] = useReducer(requestParamsReducer, {
    ...parsedQueryArgs.current,
  });

  useEffect(() => {
    const handleHistoryChanges = (e: PopStateEvent) => {
      const resetQueryArgs: Partial<EmployeeListingAPIParams> = {
        certification_ids: [],
        job_role_ids: [],
        page: 1,
        search: '',
        skills: [],
      };
      parsedQueryArgs.current = parseQueryArgs(e?.state);
      updateQueryArgs({ ...resetQueryArgs, ...parsedQueryArgs.current });
    };

    // https://github.com/interviewstreet/skillup-frontend/issues/107
    window.addEventListener('popstate', handleHistoryChanges);

    return () => {
      window.removeEventListener('popstate', handleHistoryChanges);
    };
  }, [query]);

  useGetEmployeeesQuery({ ...queryArgs });

  const contextVal = useMemo(() => ({ queryArgs, updateQueryArgs }), [queryArgs, updateQueryArgs]);

  return <QueryArgsContext.Provider value={contextVal}>{children}</QueryArgsContext.Provider>;
}
