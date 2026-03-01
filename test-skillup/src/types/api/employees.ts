import { RatingCutoffs } from './common';
import { SkillsDataType } from './skills';
import { UserRolesType } from '../auth';
import { JobRoleType, ProficiencyType } from '../common';

export type OnboardingStatus =
  | 'pending'
  | 'product_preview_completed'
  | 'self_rating_completed'
  | 'profile_setup_loader'
  | 'homepage_tour_completed';

export type EmployeeDetailsType = {
  data: {
    id: number;
    attributes: EmployeeDetailsAtributes;
  };
};

export type EmployeeDetailsAtributes = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRolesType;
  job_role: JobRoleType | null;
  recruit_candidate_uuid: string;
  badges_count?: number;
  certifications_count?: number;
  onboarding_status: OnboardingStatus;
};

export type AssessmentDataType = {
  id: number;
  attributes: {
    attempt_number: number;
    completed_at: string;
    name: string;
    report_url: string;
    retake_url: string;
    skills: SkillsDataType[];
  };
};

export type AssessmentMetaDataType = {
  page: number;
  size: number;
  total_pages: number;
  result_count: number;
};

export type EmployeeAssessmentHistoryType = {
  data: AssessmentDataType[];
  meta: AssessmentMetaDataType;
};

export type AssessmentHistoryArgs = {
  id: number;
  skill_id?: string;
  page?: string;
  size?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
};

export type EmployeeSkillsType = {
  data: SkillDatum[];
};

export type SkillDatum = {
  id: number;
  attributes: {
    skill_id: string;
    name: string;
    proficiency: ProficiencyType;
    rating: number;
    rating_cutoffs: RatingCutoffs;
    progress: Progress;
  };
};

export type Progress = {
  from_date?: Date;
  to_date?: Date;
  percent_change: number;
};

export type EmployeeCertificatonType = {
  data: EmployeeCertificatonData[];
};

export type EmployeeCertificatonData = {
  id: number | string;
  attributes: EmployeeCertificatonAttributes;
};

export type EmployeeCertificatonAttributes = {
  name: string;
  description: string;
  issued_at: string;
  skills: CertificationSkillDatum[];
  report_url: string;
};

export type CertificationSkillDatum = {
  id: string;
  name: string;
  proficiency: ProficiencyType;
};

export type BadgeAPIParams = {
  employeeID: number;
  skill_id?: string;
};

export type IndividualSkillDetailsType = {
  data: {
    id: string;
    attributes: SkillDetailAttributes;
  };
};

export type IndividualSkillQueryParameters = {
  employeeId: number;
  skillId: string;
  progress_from_date?: Date;
  progress_to_date?: Date;
  select?: string;
};

export type SkillDetailAttributes = {
  name: string;
  proficiency: ProficiencyType;
  rating: number;
  badges: SkillDetailBadges[];
  concepts: SkillDetailConcepts[];
  progress: SkillDetailProgress[];
};

export type SkillDetailBadges = {
  id: number;
  title: string;
  proficiency: ProficiencyType;
  priority: number;
  issued_at: string;
  skill_name: string;
  image_urls: BadgeImage;
};

export type SkillDetailConcepts = {
  id: number;
  name: string;
  rating: number;
  interpretation: string;
};
export type SkillDetailProgress = {
  timestamp: string;
  assessment: SkillDetailAssessment;
  new_rating: number;
  old_rating: number;
  new_proficiency: ProficiencyType;
  old_proficieny: ProficiencyType;
  rating_change_percent: number;
};
export type SkillDetailAssessment = {
  name: string;
  max_score: number;
  obtained_score: number;
};
export type BadgeImage = {
  icon: string;
};

export type EmployeeType = {
  data: EmployeeDatum[];
  meta: EmployeeTypeMeta;
};

export type EmployeeDatum = {
  id: number;
  attributes: EmployeeDatumAttributes;
};

export type EmployeeDatumAttributes = {
  name: string;
  email: string;
  job_role: JobRoleType;
  skills: EmployeeSkill[];
  certifications: Certification[];
};

export type Certification = {
  id: number;
  name: string;
};

export type EmployeeSkill = {
  skill_id: string;
  name: string;
  proficiency: ProficiencyType;
};

export type EmployeeTypeMeta = {
  page: number;
  size: number;
  total_pages: number;
  result_count: number;
};

export type EmployeeListingAPIParams = {
  page: number;
  size: number;
  skills: EmployeeListingAPIParamsSkillIDs[];
  job_role_ids: string[];
  certification_ids: string[];
  search: string;
};

export type EmployeeListingAPIParamsSkillIDs = {
  id: string;
  proficiencies: string[];
};

export type EmployeeFiltersType = {
  data: EmployeeFiltersData;
};

export type EmployeeFiltersData = {
  skills: EmployeeFiltersDataSkills[];
  job_roles: EmployeeFiltersJobRoles[];
  certifications: EmployeeFiltersCertifications[];
};

export type EmployeeFiltersDataSkills = {
  name: string;
  id: string;
};

export type EmployeeFiltersJobRoles = {
  name: string;
  id: string;
};

export type EmployeeFiltersCertifications = {
  name: string;
  id: string;
};

export type AssessmentsType = {
  data: AssessmentsDatum[];
};

export type AssessmentsDatum = {
  id: number;
  attributes: AssessmentsDatumAttributes;
};

export type AssessmentsDatumAttributes = {
  name: string;
  recruit_test_id: number;
};

export type AssessmentsAPIParams = {
  skills_ids: string;
  search: string;
  proficiency: ProficiencyType;
};

export type EmployeeCertificatonArgs = {
  employeeID: number;
};
