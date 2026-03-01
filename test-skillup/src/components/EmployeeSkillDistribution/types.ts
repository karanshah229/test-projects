import { JobRoleSkillType } from 'src/types/api/job_roles';
import { ProficiencyType } from 'src/types/common';

export type SeriesDataType = {
  type: string;
  name: string;
  data: number[];
  pointPlacement: string;
  color: string;
  lineColor: string;
  marker: {
    symbol: string;
    fillColor: string;
    lineWidth: number;
    lineColor: string;
  };
};

export type PointDataType = {
  x: string;
  y: number;
  color: string;
  series: {
    name: string;
  };
};

export type SkillProficiencyMapType = {
  [key: string]: Partial<JobRoleSkillType> & {
    current_proficiency?: ProficiencyType | null;
    target_proficiency?: ProficiencyType | null;
  };
};
