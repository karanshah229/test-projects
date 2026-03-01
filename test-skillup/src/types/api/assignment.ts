import { ProficiencyType } from 'src/types/common';

import { CertificationMetadata } from './common';

export type AssignmentType = 'certification' | 'skill';

export type AssignmentData = {
  data: AssignmentDatum[];
};

export type AssignmentDatum = {
  id: number;
  attributes: AssignmentAttributes;
};

export type AssignmentAssignedByType = {
  first_name: string;
  last_name: string;
};

export type AssignmentSkillMetadata = {
  proficiency: ProficiencyType;
  proficiency_progress_percentage: number;
};

export type AssignmentAttributes = {
  name: string;
  entity_type: AssignmentType;
  entity_id: string;
  assigned_by: AssignmentAssignedByType;
  due_date: string | null;
  completed_on: string | null;
  metadata: CertificationMetadata | AssignmentSkillMetadata;
};
