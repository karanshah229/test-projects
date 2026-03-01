import { UserRolesType } from 'src/types/auth';
import {
  OnboardingStatusType,
  PrerequisiteStatusType,
  ProficiencyPropsType,
  ProficiencyType,
  RouteType,
  UserDropdownAction,
} from 'src/types/common';

const { i18n } = require('../../next-i18next.config');

export const APP_PREFIX = '/skillup';

// TODO: Make it configurable from an API, so that others - PMs, etc. can also show / hide routes
export const ROUTES: RouteType[] = [
  {
    path: '/home',
    appHeaderNavLinkOptions: {
      i18nTitleKey: 'app_header.home',
      showInHeader: true,
      showActiveState: true,
    },
    protected: true,
    roles_allowed: ['admin'],
  },
  {
    path: '/skills',
    protected: true,
    appHeaderNavLinkOptions: {
      i18nTitleKey: 'app_header.skills',
      showInHeader: true,
      showActiveState: true,
    },
    roles_allowed: [],
  },
  {
    path: '/overview',
    protected: true,
    appHeaderNavLinkOptions: {
      i18nTitleKey: 'app_header.overview',
      showInHeader: true,
      showActiveState: true,
    },
    roles_allowed: ['admin'],
  },
  {
    path: '/employees',
    protected: true,
    appHeaderNavLinkOptions: {
      i18nTitleKey: 'app_header.talent_directory',
      showInHeader: true,
      showActiveState: true,
    },
    roles_allowed: ['admin'],
    childRoutes: [
      {
        path: '/employees/[id]',
        protected: true,
        appHeaderNavLinkOptions: {
          showInHeader: false,
          showParentRouteActiveState: false,
        },
        roles_allowed: ['admin'],
      },
    ],
  },
];

type RoutePermissionsIndexType = { [key: string]: UserRolesType[] };
export const ROUTE_PERMISSIONS_INDEX: RoutePermissionsIndexType = (() => {
  // Can't put in util since it causes a dependency cycle

  const flattenedRoutes = [...ROUTES];
  flattenedRoutes.map((route) => {
    route.childRoutes?.forEach((childRoute) => {
      flattenedRoutes.push(childRoute);
    });
    const { childRoutes: _cr, ...rest } = route;
    return rest;
  });
  const index = {} as RoutePermissionsIndexType;
  flattenedRoutes.forEach((route) => {
    index[route.path] = route.roles_allowed;
  });

  return index;
})();

export const ONBOARDING_ROUTE = `${APP_PREFIX}/welcome`;

export const UserRoleHomePageMapping: {
  [key in UserRolesType]: string;
} = {
  admin: `${APP_PREFIX}/overview`,
  trainee: `${APP_PREFIX}/home`,
};

export const UN_PROTECTED_ROUTES = [
  `${APP_PREFIX}/healthcheck`,
  `${APP_PREFIX}/404`,
  `${APP_PREFIX}/403`,
];

export const HEADER_USER_DROPDOWN_ACTIONS: UserDropdownAction[] = [];

export const HIDE_APP_NAV_ON_PATHS = ['/', '/healthcheck'];

export const CDN_DOMAIN = process.env.NEXT_PUBLIC_CDN_URL
  ? `https://${process.env.NEXT_PUBLIC_CDN_URL}`
  : '';

export const CDN_URL_PREFIX = `${CDN_DOMAIN ?? ''}${APP_PREFIX}${
  CDN_DOMAIN ? '/_next/static' : ''
}/assets`;

export const CDN_ASSET_FOLDER_PATH = {
  badge: '/badges',
  icons: '/icons',
  employeeSkillProfile: '/employee_skill_profile',
  employeeSkillDistribution: '/employee_skill_profile/employee_skill_distribution',
  employeeAssessmentHistory: '/employee_skill_profile/employee_assessment_history',
  skill_logos: '/skill_logos',
};

// Frozen object, cannot be modified at runtime
export const PROFICIENCIES: Readonly<Record<ProficiencyType, ProficiencyType>> = Object.freeze({
  prebeginner: 'prebeginner',
  beginner: 'beginner',
  intermediate: 'intermediate',
  expert: 'expert',
});

export const API_VERSIONS = {
  v1: 'v1',
  v2: 'v2',
} as const;

export const PROFICIENCES: ProficiencyType[] = [
  'prebeginner',
  'beginner',
  'intermediate',
  'expert',
];

export const ENV_VARS: any = {};

export const COOKIE_KEYS_TO_INCLUDE = ['access_token', 'jwt_access_token', 'jwt_refresh_token'];

export const proficiencyAttributes: ProficiencyPropsType = {
  prebeginner: {
    label: 'Pre-beginner',
    tag: 'default',
    color: '--sklup-prebeginner-color',
    defaultCutOff: 0,
  },
  beginner: {
    label: 'Beginner',
    tag: 'secondary',
    color: '--hr-secondary-40',
    defaultCutOff: 100,
  },
  intermediate: {
    label: 'Intermediate',
    tag: 'success',
    color: '--sklup-intermediate-color',
    defaultCutOff: 200,
  },
  expert: {
    label: 'Expert',
    tag: 'primary',
    color: '--sklup-expert-color',
    defaultCutOff: 290,
  },
};

export const HOURS_6_IN_MILLISECONDS = 6 * 60 * 60 * 1000;

export enum KeyboardKey {
  ENTER = 'Enter',
  SPACE = ' ',
}
export const PROGRESS_CHART_PLOTLINES = [50, 100, 200, 300];

export const durationFilterOptions = [
  { i18nKey: 'three_months', value: 90 },
  { i18nKey: 'six_months', value: 180 },
  { i18nKey: 'twelve_months', value: 365 },
  { i18nKey: 'all_time', value: 'ALL_TIME' },
];

export const i18nLocales: string[] = i18n.locales;
export const ONBOARDING_STATUS: Record<string, OnboardingStatusType> = {
  PENDING: 'pending',
  PRODUCT_PREVIEW_COMPLETED: 'product_preview_completed',
  SELF_RATING_COMPLETED: 'self_rating_completed',
  PROFILE_SETUP_LOADER: 'profile_setup_loader',
  HOMEPAGE_TOUR_COMPLETED: 'homepage_tour_completed',
};

export const PREREQUISITE_STATUS: Record<string, PrerequisiteStatusType> = {
  NOT_APPLICABLE: 'not_applicable',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export const ASSIGNMENT_TYPE = {
  SKILL: 'skill',
  CERTIFICATION: 'certification',
};
