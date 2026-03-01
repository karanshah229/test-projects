import { SkillDatum } from './employees';
import { UserRolesType } from '../auth';
import { JobRoleType, OnboardingStatusType } from '../common';

export type Application = 'skillup' | 'engage' | 'hackerrank-for-work';

export enum UserAdditionalAttributes {
  BADGES_COUNT = 'badges_count',
  CERTIFICATIONS_COUNT = 'certifications_count',
  ONBOARDING_STATUS = 'onboarding_status',
}

export type UserDetailsQueryArgs = {
  additional_attributes?: UserAdditionalAttributes[];
};

export type UserDetailsUpdateArgs = {
  onboarding_status: OnboardingStatusType;
};

export type UserDetailsType = {
  data: UserDetailsDataType;
};

export type UserDetailsDataType = {
  id: number;
  attributes: UserDetailsDataAttributesType;
};

export type UserDetailsDataAttributesType = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  job_role: JobRoleType;
  role: UserRolesType;
  hrw_accessible: boolean;
  designation: string;
  certifications_count?: number;
  badges_count?: number;
  profile_enabled: boolean;
  employee_skills: SkillDatum[];
  onboarding_status: OnboardingStatusType;
};

export type HRWUserDetailsType = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  status: string;
  role: string;
  country: string;
  phone: string;
  timezone: string;
  tests_permission: number;
  questions_permission: number;
  interviews_permission: number;
  candidates_permission: number;
  shared_tests_permission: number;
  shared_questions_permission: number;
  shared_interviews_permission: number;
  shared_candidates_permission: number;
  created_at: string;
  company_admin: boolean;
  team_admin: boolean;
  teams: string[];
  activated: boolean;
  last_activity_time: string;
  applications_enabled: Application[];
};

export type LogoutResponse = {
  status: boolean;
};

export type LogoutErrorResponse = {
  data: {
    active_sessions: number;
    status: boolean;
  };
  status: number;
};
