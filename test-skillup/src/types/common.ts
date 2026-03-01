import { UserRolesType } from './auth';

export type RouteHiddenInHeader = {
  showInHeader: false;
  showParentRouteActiveState: boolean; // `showActiveState` does not make sense here since showInHeader is false
};
export type RouteShownInHeader = {
  showInHeader: true;
  i18nTitleKey?: string; // Only for routes that are shown in Header
  showActiveState: boolean; // Currently not taking multi-level links into account in AppHeader, hence no `showParentRouteActiveState` here
};

export type RoutePathType =
  | '/overview'
  | '/employees'
  | '/employees/[id]'
  | '/employees/me/profile'
  | '/upskill'
  | '/home'
  | '/assignments'
  | '/welcome'
  | '/skills';

export type RouteType = {
  path: RoutePathType;
  protected: boolean;
  appHeaderNavLinkOptions: RouteHiddenInHeader | RouteShownInHeader;
  roles_allowed: Partial<UserRolesType>[];
  childRoutes?: RouteType[];
};

export type ProficiencyType = 'prebeginner' | 'beginner' | 'intermediate' | 'expert';

export type DifficultyType = 'easy' | 'medium' | 'hard';

export type SkillAndCertificationStatusType = 'pending' | 'in_progress' | 'completed';

export type AssignmentType = 'skill' | 'certification';

export type ModuleStatusType = 'pending' | 'completed';

export type PrerequisiteStatusType = 'not_applicable' | 'pending' | 'completed';

export type SkillDataType = {
  id: string;
  proficiency?: ProficiencyType;
  name?: string;
};

export type ProficiencyPropsType = Record<
  ProficiencyType,
  {
    label: string;
    tag: string;
    color: string;
    defaultCutOff: number;
  }
>;

export type UserDropdownAction = {
  actionTitleI18nKey: string;
  actionLink: string;
};

export type DrawerContextType = {
  isOpen: boolean;
  openDrawer: VoidFunction;
  closeDrawer: VoidFunction;
};

export type JobRoleType = {
  id: string;
  name: string;
};

export type CertificationPrerequisitesType = {
  total: number;
  completed: number;
  pending: number;
};

export type OnboardingStatusType =
  | 'pending'
  | 'product_preview_completed'
  | 'self_rating_completed'
  | 'profile_setup_loader'
  | 'homepage_tour_completed';
