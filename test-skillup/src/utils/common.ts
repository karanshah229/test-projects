import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

import {
  API_VERSIONS,
  APP_PREFIX,
  CDN_ASSET_FOLDER_PATH,
  CDN_URL_PREFIX,
  ENV_VARS,
  i18nLocales,
} from 'src/constants/common';
import { BadgeDatum, BadgeDatumAttributes } from 'src/types/api/common';
import { ProficiencyType, RouteHiddenInHeader, RouteType } from 'src/types/common';

import type { SortDescriptor } from '@react-types/shared';

export type GetNavActiveStateProps = {
  routerAsPath: string; // router.asPath()
  navURL: string; // route path set in ROUTE constants
  childRoutes?: RouteType[];
  currentPathname?: string; // URL in page nextjs page strucutre - /employee/[id]
};

export const isClient = typeof window !== 'undefined';

export const isServer = !isClient;

export const isDev = process.env.NODE_ENV === 'development';

function getAllChildRoutes(initialRoutes: RouteType[]) {
  const allRoutes: Omit<RouteType, 'childRoutes'>[] = [];

  function f(route: RouteType) {
    const { childRoutes: _cR, ...restProps } = route;

    allRoutes.push({ ...restProps });
    route.childRoutes?.forEach((r) => f(r));
  }

  initialRoutes.forEach((route) => {
    f(route);
  });

  return allRoutes;
}

export function getNavActiveState(props: GetNavActiveStateProps) {
  const { routerAsPath, navURL, childRoutes: childRoutesProp, currentPathname } = props;
  let result = routerAsPath.split('?')[0] === navURL; // remove request params

  const childRoutes = getAllChildRoutes(childRoutesProp);

  if (!result && childRoutes.length !== 0) {
    result =
      result ||
      childRoutes.some(
        (childRoute) =>
          childRoute.path === currentPathname &&
          (childRoute.appHeaderNavLinkOptions as RouteHiddenInHeader).showParentRouteActiveState ===
            true,
      );
  }

  return result;
}

/**
 * @returns an object containing the runtime ENV variables
 */
export function getEnvVars() {
  const { publicRuntimeConfig } = getConfig();

  return {
    BACKEND_URL: publicRuntimeConfig.BACKEND_URL,
    CDN_URL: publicRuntimeConfig.CDN_URL,
  };
}

/**
 *
 * @param {object} envVars
 * @description store the env vars on server side for use on client side
 */
export function setEnvVars(envVars: object) {
  Object.entries(envVars).forEach(([key, val]) => {
    ENV_VARS[key] = val;
  });
}

/**
 *
 * @returns {string} skillup backend url origin to make API requests
 */
export function getBackendURLOrigin() {
  if (isDev) {
    if (isServer) return process.env.BACKEND_URL;
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }

  const envVars = getEnvVars();
  setEnvVars(envVars);

  // Static pages - ex: 404 run only at build time and not on server
  // Hence need to manually set the BACKEND_URL
  if (isClient && !ENV_VARS.BACKEND_URL) {
    ENV_VARS.BACKEND_URL = `https://appgateway-${window.location.hostname}`;
  }

  return ENV_VARS.BACKEND_URL;
}

/**
 *
 * @param {keyof typeof API_VERSIONS} apiVersion
 * @returns {string} base url to make API requests.
 */
export function getBackendURL(apiVersion: keyof typeof API_VERSIONS) {
  return `${getBackendURLOrigin()}${APP_PREFIX}/api/${apiVersion}`;
}

export function openInNewTab(url: string) {
  if (isClient) {
    window?.open(url, '_blank');
  }
}

/**
 *
 * @param {BadgeDatumAttributes} badgeAttributes
 * @param {boolean} [withExtension]
 * @returns the filename of the image of badge.
 * For example, this would return "angular__beginner.svg" | "html_css_js__expert.svg".
 */
export function getBadgeImageFileName({
  badgeAttributes,
  withExtension = true,
}: {
  badgeAttributes: BadgeDatumAttributes;
  withExtension?: boolean;
}) {
  if (!badgeAttributes.proficiency) return '';

  // TODO: badgeFileName should be based on skill_id_proficiency instead of skill_name
  const badgeFileName = badgeAttributes.skill_name
    .split(/[\s/-]+/)
    .join('_')
    .concat(`__${badgeAttributes.proficiency}`)
    .toLowerCase();
  const fileExtension = withExtension ? '.svg' : '';

  return encodeURIComponent(badgeFileName + fileExtension);
}

/**
 *
 * @param {ReturnType<typeof getBadgeImageFileName>} badgeFilePath
 * @returns the filepath of the image of badge along with filename.
 * For example, this would return "/badges/Angular__Beginner.svg" | "/badges/HTML_CSS_JS__Expert.svg".
 */
export function getBadgeImageFilePath(badgeFilePath: ReturnType<typeof getBadgeImageFileName>) {
  return badgeFilePath ? `${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.badge}/${badgeFilePath}` : '';
}

/**
 *
 * @param {ProficiencyType} prof1
 * @param {ProficiencyType} prof2
 * @returns the higher proficiency.
 */
export function compareProficiencies(
  prof1: ProficiencyType,
  prof2: ProficiencyType,
): ProficiencyType {
  if (prof1 === 'beginner' && prof2 === 'prebeginner') {
    return prof1;
  }
  if (prof1 === 'intermediate' && (prof2 === 'beginner' || prof2 === 'prebeginner')) {
    return prof1;
  }
  if (
    prof1 === 'expert' &&
    (prof2 === 'intermediate' || prof2 === 'beginner' || prof2 === 'prebeginner')
  ) {
    return prof1;
  }
  if (prof1 === prof2) {
    return null;
  }
  return prof2;
}

/**
 *
 * @param {ProficiencyType} prof1
 * @param {ProficiencyType} prof2
 * @returns the higher proficiency in numeric form.
 *
 * For example, this would return
 * 1 - meaning prof1,
 * -1 - meaning prof2,
 * 0 - both have same prof.
 *
 * return type is number so that sort function can also use it
 */
export function sortProficiencies(prof1: ProficiencyType, prof2: ProficiencyType): number {
  if (prof1 === 'beginner' && prof2 === 'prebeginner') {
    return 1;
  }
  if (prof1 === 'intermediate' && (prof2 === 'beginner' || prof2 === 'prebeginner')) {
    return 1;
  }
  if (
    prof1 === 'expert' &&
    (prof2 === 'intermediate' || prof2 === 'beginner' || prof2 === 'prebeginner')
  ) {
    return 1;
  }
  if (prof1 === prof2) {
    return 0;
  }
  return -1;
}

/**
 *
 * @param {BadgeDatum} badge1
 * @param {BadgeDatum} badge2
 * @returns the order of badges according to proficiency + recency.
 * For example, this would return
 * badge1,
 * badge2,
 * null
 */
export function compareBadges(badge1: BadgeDatum, badge2: BadgeDatum): BadgeDatum {
  const proficiency = sortProficiencies(
    badge1.attributes.proficiency,
    badge2.attributes.proficiency,
  );
  if (proficiency === 0) {
    // Same proficiency, check recency
    const d1 = new Date(badge1.attributes.issued_at);
    const d2 = new Date(badge2.attributes.issued_at);
    if (d1 === d2) {
      // Same recency, alphabetical
      return badge1.attributes.title > badge2.attributes.title ? badge1 : badge2;
    }
    if (d1 > d2) {
      return badge1;
    }
    return badge2;
  }
  return proficiency === 1 ? badge1 : badge2;
}

/**
 *
 * @param {BadgeDatum} badge1
 * @param {BadgeDatum} badge2
 * @returns the order of badges according to proficiency + recency.
 * For example, this would return
 * 1 - meaning badge1,
 * -1 - meaning badge2,
 * 0 - both have same prof and recency.
 *
 * return type is number so that sort function can use it
 */
export function sortBadges(badge1: BadgeDatum, badge2: BadgeDatum): number {
  const proficiency = sortProficiencies(
    badge1.attributes.proficiency,
    badge2.attributes.proficiency,
  );
  if (proficiency === 0) {
    // Same proficiency, check recency
    const d1 = new Date(badge1.attributes.issued_at);
    const d2 = new Date(badge2.attributes.issued_at);
    if (d1 === d2) {
      // Same recency, alphabetical
      return badge1.attributes.title > badge2.attributes.title ? 1 : -1;
    }
    if (d1 > d2) {
      return 1;
    }
    return -1;
  }
  return proficiency;
}

/**
 *
 * @param {T} object - Object to remove empty entries from
 * @returns object with empty entries removed
 */
export function removeEmptyEnteries<T>(object: T) {
  /* eslint-disable no-param-reassign */
  Object.entries(object).forEach(([key, val]) => {
    if (val === null || val === undefined) delete object[key];
    else if (typeof val === 'string' && val.length === 0) delete object[key];
    else if (typeof Array.isArray(val) && val.length === 0) delete object[key];
    else if (typeof val === 'object') {
      if (Object.keys(val).length === 0) delete object[key];
      else removeEmptyEnteries(val);
    }
  });
  return object;
  /* eslint-enable no-param-reassign */
}

/**
 *
 * @param percentChange
 * @returns HRDS color for the tag based on percent change
 */
export const progressTagColor = (percentChange: number) => {
  if (percentChange <= 0 && percentChange >= -20) return 'warning';
  if (percentChange < -20) return 'critical';

  return 'primary';
};

/**
 *
 * @param proficiency
 * @returns default proficiency cutoff when, null
 */
export const getDefaultProficiencyCutoff = (proficiency: ProficiencyType) => {
  let cutoff = 0;

  switch (proficiency) {
    case 'beginner':
      cutoff = 100;
      break;
    case 'intermediate':
      cutoff = 200;
      break;
    case 'expert':
      cutoff = 290; // Not 300, else the text for "Expert" in Progress Chart will go out of bounds
      break;
    default:
      break;
  }

  return cutoff;
};

/**
 *
 * @param {string} str
 * @returns {boolean} if the string is empty after cleaning it
 */
export function isEmptyStr(str: string) {
  return str.trim().length === 0;
}

export function urlContainsFilename(url: string) {
  return url.split('/').slice(-1)[0].includes('.');
}

export function getCurrentURL(req?: NextApiRequest | GetServerSidePropsContext['req']) {
  if (isServer && req) {
    return `${APP_PREFIX}${req.url}`; // `/` already present in req.url
  }
  return window.location.href.replace(window.location.origin, '');
}

/**
 *
 * @param {string} string
 * @param {object} obj
 * @returns {string} string that has template values replaced with variables passed in obj
 */
export function templateString(string: string, obj: object): string {
  let s = string;
  Object.keys(obj).forEach((prop) => {
    s = s.replace(new RegExp(`{{${prop}}}`, 'g'), obj[prop]);
  });
  return s;
}

type CandidatesListTestInvite = {
  name: string;
  email: string;
};

/**
 *
 * @param {number} testID
 * @param {CandidatesListTestInvite[]} candidates
 * @returns {string} HRW test invite url with candidate details as query params
 */
export function getTestInviteURL(testID: number, candidates: CandidatesListTestInvite[]) {
  if (!testID || candidates.length === 0) return '';

  const candidatesString = JSON.stringify(candidates);
  const encodedCandidates = encodeURIComponent(candidatesString);
  const url = `${window.location.origin}/work/tests/${testID}/candidates/invite?candidates[]=${encodedCandidates}&closetabonsubmit=true`;

  return url;
}

/**
 *
 * @param {string} firstname
 * @param {string} lastname
 * @returns {string} Full name by concatinating firstname and lastname
 */
export function getUserFullName(firstname: string = '', lastname: string = '') {
  return `${firstname.trim()} ${lastname.trim()}`.trim();
}

/**
 *
 * @param {{ name: string }} skillAttributes
 * @param {boolean} [withExtension]
 * @returns the filename of the image of Skill Logo.
 * For example, this would return "angular.svg" | "html_css_js.svg".
 */
export function getSkillLogoImageFileName({
  skillAttributes,
  withExtension = true,
}: {
  skillAttributes: { name: string };
  withExtension?: boolean;
}) {
  // TODO: skillLogoFileName should be based on skill_id_proficiency instead of skill_name
  const skillLogoFileName = skillAttributes.name
    .split(/[\s/]+/)
    .join('_')
    .toLowerCase();

  const fileExtension = withExtension ? '.svg' : '';

  return encodeURIComponent(skillLogoFileName + fileExtension);
}

/**
 *
 * @param {ReturnType<typeof getSkillLogoImageFileName>} skillLogoFilePath
 * @returns the filepath of the image of Skill Logo along with filename.
 * For example, this would return "/skill_logos/angular.svg" | "/skill_logos/html_css_js.svg".
 */
export function getSkillLogoImageFilePath(
  skillLogoFilePath: ReturnType<typeof getSkillLogoImageFileName>,
) {
  return skillLogoFilePath
    ? `${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.skill_logos}/${skillLogoFilePath}`
    : '';
}
/**
 *
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {string} property
 * @returns {number} Any 1 of the numbers [-1, 0, 1] intended to be passed to the JS sort function
 */
export function sortObjectsByStringProperty(obj1: Object, obj2: Object, property: string) {
  let firstValue = obj1[property];
  let secondValue = obj2[property];

  if (typeof obj1[property] === 'string' && typeof obj2[property] === 'string') {
    firstValue = obj1[property].toUpperCase();
    secondValue = obj2[property].toUpperCase();
  }

  if (firstValue > secondValue) return 1;
  if (secondValue > firstValue) return -1;
  return 0;
}

/**
 *
 * @param {Object} SortDescriptor
 * @param {Array} tableData
 * @param {string} tieBreakerKey
 * @returns {Object} Return an object containing updated sortDescriptor and sorted Table Data.
 */
export function sortTableData(
  value: SortDescriptor,
  tableData: any[],
  tieBreakerKey: string,
): { updatedSortDescriptor: SortDescriptor; updatedTableData: any[] } {
  const { column, direction } = value;
  const updatedTableData = [...tableData];

  let key;
  if (column) {
    key = column;
  }

  updatedTableData.sort((a, b) => {
    const first = a?.[key];
    const second = b?.[key];
    const firstNumeric = parseInt(first, 10);
    const secondNumeric = parseInt(second, 10);
    let cmp = (firstNumeric || first) < (secondNumeric || second) ? -1 : 1;
    if (firstNumeric === secondNumeric) {
      cmp = a?.[tieBreakerKey] < b?.[tieBreakerKey] ? -1 : 1;
    }
    if (direction === 'descending') {
      cmp *= -1;
    }
    return cmp;
  });
  return { updatedSortDescriptor: value, updatedTableData };
}

/**
 *
 * Debounces the given function, ensuring it is only called after the specified wait time has passed since the last invocation.
 * @param {Function} func - The function to be debounced.
 * @param {number} wait - The wait time in milliseconds.
 * @returns {Function} - The debounced function.
 *
 */
export function debounce(func: Function, wait: number) {
  let timeout;

  return function debounced(...args) {
    const later = () => {
      timeout = null;

      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 *
 * Gets the user initals from the first name and / or last name
 * @param {string} firstName - The function to be debounced.
 * @param {string} lastName - The wait time in milliseconds.
 * @returns {string} - A string with first letter of first name and first letter of last name joined.
 *
 */
export function getUserInitials(firstName: string = '', lastName: string = '') {
  if (isEmptyStr(firstName)) return '';
  if (isEmptyStr(lastName)) return firstName.charAt(0);
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

/**
 *
 * Redirects the client to the passed url
 * @param {string} url - The url to redirect to.
 * @param {NextApiResponse} res - Next's response object.
 *
 */
export async function redirect(
  url: string,
  res?: NextApiResponse | ServerResponse<IncomingMessage>,
) {
  if (isServer && res) {
    if (!res.writableEnded) {
      res.writeHead(307, { Location: url });
      res.end();
    }
  } else {
    window.location.assign(url);
    await new Promise(() => {}); // Stop Page from rendering
  }
}

/**
 *
 * Trim's the SSR URL received on server
 * @param {string} url - The url to trim
 * @param {string} url - The trimmed SSR URL that removes prefix `/_next/data/development` and suffix `.json` using locales like `/en`
 *
 */
export function trim_Next_SSR_URL(url: string) {
  const i18nLocalesLength = i18nLocales.length;
  for (let i = 0; i < i18nLocalesLength; i += 1) {
    if (url.includes(i18nLocales[i])) {
      // Remove prefix `/_next/data/development` and suffix `.json` using locales like `/en`
      // eslint-disable-next-line prefer-destructuring
      return url.split('/en')[1].split('.')[0];
    }
  }

  return '';
}

/**
 *
 * composes (runs one after another) 2 event handlers for the same event
 * @param originalEventHandler - The event handler of another component (eg: Parent, Child component)
 * @param ourEventHandler - Our component's event handler for the same event
 * @param {object} params - Optional params
 * checkForDefaultPrevented - Checks if event.defaultPrevented
 * @returns {Function} An event handler that calls both - the original and ourEventHandler
 *
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (checkForDefaultPrevented === false || !(event as unknown as Event)?.defaultPrevented) {
      return ourEventHandler?.(event);
    }

    return undefined;
  };
}

/**
 *
 * composes multiple event handlers together using `composeEventHandlers` util
 * @param eventHandlerMap - An object with key as eventName and value as an array of 2 event handlers
 * @returns {Function} An object with key as eventName and value as composedEventHandler
 *
 */
export function composeMultipleEventHandlers(eventHandlerMap: { [key: string]: any[] }) {
  const composedEventHandlerMap = {};
  Object.entries(eventHandlerMap).forEach(([eventHandlerName, eventHandlers]) => {
    composedEventHandlerMap[eventHandlerName] = composeEventHandlers(...eventHandlers);
  });

  return composedEventHandlerMap;
}

/**
 *
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to be capitalized.
 * @returns {string} - The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns the appropriate indefinite article ('a' or 'an') for the given word.
 * @param {string} word - The word for which to determine the article.
 * @returns {string} 'an' | 'a' - The indefinite article ('a' or 'an') for the given word.
 */
export function getArticle(word: string): 'an' | 'a' {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const firstLetter = word?.[0]?.toLowerCase();
  return vowels.includes(firstLetter) ? 'an' : 'a';
}

/**
 * Returns the Levenshtein distance factor between two strings, needle and haystack. https://en.wikipedia.org/wiki/Levenshtein_distance
 * @param {string} needle - The first string to compare.
 * @param {string} haystack - The second string to compare.
 * @returns {number} - The Levenshtein distance factor, which is the ratio of the Levenshtein distance between the two strings to the maximum length of the two strings.
 */
export function getLevenshteinDistanceFactor(needle: string, haystack: string): number {
  const needleLength: number = needle?.length || 0;
  const haystackLength: number = haystack?.length || 0;

  if (!needleLength || !haystackLength) {
    return 1;
  }

  const matrix: number[][] = Array.from({ length: needleLength + 1 }, () =>
    Array(haystackLength + 1),
  );

  for (let i = 0; i <= needleLength; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= haystackLength; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= needleLength; i += 1) {
    for (let j = 1; j <= haystackLength; j += 1) {
      if (needle[i - 1] === haystack[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1,
        );
      }
    }
  }

  return matrix[needleLength][haystackLength] / Math.max(needleLength, haystackLength);
}

/**
 * Returns a boolean value indicating whether the target string matches the query string based on a given match factor.
 * @param {string} query - The query string to search for.
 * @param {string} string - TThe target string to search within.
 * @param {number} matchFactor - The match factor that determines the level of similarity required for a match.
 * @returns {boolean} - Returns true if the target string matches the query string based on the match factor, otherwise returns false.
 */
export function fuzzySearch(query: string, target: string, matchFactor: number): boolean {
  if (query?.length === 0 && target?.length !== 0) return false;
  return target.includes(query) || getLevenshteinDistanceFactor(query, target) < matchFactor;
}
