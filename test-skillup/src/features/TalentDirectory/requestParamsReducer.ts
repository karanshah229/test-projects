import { APP_PREFIX } from 'src/constants/common';
import { EmployeeListingAPIParams } from 'src/types/api/employees';
import { isClient, removeEmptyEnteries } from 'src/utils/common';

const apiRequestParamsParser: Record<string, Function> = {
  page: (page: number) => page.toString(),
  size: (size: number) => size.toString(),
  skills: (skill_ids: { [key: string]: { [key: string]: string } }) => JSON.stringify(skill_ids),
  certification_ids: (certifications: string[]) => certifications?.join(','),
  job_role_ids: (designations: string[]) => designations?.join(','),
  search: (search: string) => encodeURIComponent(search),
};
const apiRequestParams = Object.keys(apiRequestParamsParser);

export function getNewURL(newState: Partial<EmployeeListingAPIParams>, urlWithOrigin = true) {
  let url = urlWithOrigin && isClient ? `${window.location.origin}${APP_PREFIX}/employees` : '';
  const requestParamsStr = Object.entries(newState)
    .filter(([key]) => apiRequestParams.includes(key))
    .map(([key, val]) => `${key}=${apiRequestParamsParser[key](val)}`)
    .join('&');

  url += requestParamsStr.length ? `?${requestParamsStr}` : '';
  return url;
}

function getNewHistoryState(newState: Partial<EmployeeListingAPIParams>) {
  const modifiedEntries = Object.entries(newState)
    .filter(([key]) => apiRequestParams.includes(key))
    .map(([key, val]) => [key, apiRequestParamsParser[key](val)]);

  return Object.fromEntries(modifiedEntries);
}

export function requestParamsReducer(state: Partial<EmployeeListingAPIParams>, action: any) {
  const newState =
    action?.type === 'CLEAR_ALL_FILTERS'
      ? {}
      : removeEmptyEnteries<Partial<EmployeeListingAPIParams>>({
          ...state,
          ...(typeof action === 'function' ? action(state) : action),
        });

  // Update browser URL
  const newURL = getNewURL(newState);
  const newHistoryState = getNewHistoryState(newState);
  const currentURL = isClient ? window.location.href : '';
  if (currentURL !== newURL) {
    // https://github.com/interviewstreet/skillup-frontend/issues/107
    window.history.pushState(newHistoryState, '', newURL);
  }

  return newState;
}
