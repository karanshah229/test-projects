import { ParsedUrlQuery } from 'node:querystring';

import { EmployeeListingAPIParams } from 'src/types/api/employees';
import { logger } from 'src/utils/logger';

const apiRequestParamsParser: Record<string, Function> = {
  page: (page: string) => parseInt(page, 10),
  size: (size: string) => parseInt(size, 10),
  skills: (skill_ids: string) => JSON.parse(skill_ids),
  job_role_ids: (job_role_ids: string) => job_role_ids?.split(','),
  certification_ids: (certification_ids: string) => certification_ids?.split(','),
  search: (search: string) => decodeURIComponent(search),
};
const apiRequestParams = Object.keys(apiRequestParamsParser);

export function parseQueryArgs(query: ParsedUrlQuery) {
  const parsedQueryArgs = {} as Partial<EmployeeListingAPIParams>;

  Object.entries(query)
    .filter(([key]) => apiRequestParams.includes(key))
    .forEach(([key, val]) => {
      try {
        parsedQueryArgs[key] = apiRequestParamsParser[key](val);
      } catch (error) {
        logger.error({
          message: 'Error parsing query args in Talent Directory',
          error,
        });
      }
    });

  return parsedQueryArgs;
}
