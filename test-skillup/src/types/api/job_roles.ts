import { PrerequisiteStatusType, ProficiencyType, SkillDataType } from 'src/types/common';

export type JobRolesType = {
  data: JobRoleDatum[];
};

export type JobRoleDatum = {
  id: string;
  attributes: JobRoleDatumAttributes;
};

export type JobRolesSelfRatedSkillsType = {
  data: JobRoleSelfRatedSkills;
};

export type JobRoleSelfRatedSkills = {
  id: string;
  attributes: JobRoleDatumAttributes;
};

export type JobRoleDatumAttributes = {
  name: string;
  certification?: JobRoleCertificationType;
  skills: JobRoleSkillType[];
};

export type JobRoleCertificationType = {
  id: string;
  name: string;
  issued_at: string | null;
  is_available: boolean;
  next_available_on: string | null;
  assessment: {
    duration: number;
  };
};

export type JobRoleSkillType = {
  id: string;
  name: string;
  slug: string;
  verified_proficiency?: ProficiencyType;
  required_proficiency: ProficiencyType;
  self_rated_proficiency?: ProficiencyType | null;
  proficiency_progress_percentage?: number;
  prerequisite: boolean;
  prerequisite_status: PrerequisiteStatusType;
};

export type UpdateJobRolesArgs = {
  job_role_id: string;
  skills: SkillDataType[];
};

export type UpdateJobRolePriorityArgs = {
  job_role_id: string;
  priority: number;
};

export type JobRoleMutationSuccessType = {
  data: {
    success: boolean;
  };
};
