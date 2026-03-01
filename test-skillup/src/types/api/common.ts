import { PrerequisiteStatusType, ProficiencyType } from '../common';

export type APIErrorType = {
  status: number;
  data: {
    statusCode: number;
    message: string | string[];
    error: string;
  };
};

export type RatingCutoffs = {
  beginner: number;
  intermediate: number;
  expert: number;
};

export type BadgesType = {
  data: BadgeDatum[];
};

export type BadgeDatum = {
  id: number;
  attributes: BadgeDatumAttributes;
};

export type BadgeDatumAttributes = {
  issued_at?: string;
  title?: string;
  skill_id?: string;
  skill_name: string;
  proficiency: ProficiencyType;
  priority: number;
  image_urls?: BadgeImageUrls;
};

export type BadgeImageUrls = {
  icon: string;
};

export type CertificationJobRoleType = {
  id: string;
  name: string;
  skills: JobRoleSkillEntity[];
};

export type JobRoleSkillEntity = {
  id: string;
  name: string;
  slug: string;
  prerequisite: boolean;
  prerequisite_status: PrerequisiteStatusType;
  required_proficiency: ProficiencyType;
};

export type CertificationMetadata = {
  job_role: CertificationJobRoleType;
  assessment: {
    duration: number;
  };
};
