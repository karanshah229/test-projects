import { JobRoleType } from '../common';

export type CertificationsOverviewType = {
  data: {
    certifications: CertificationsDataType[];
    certifications_count: number;
    certified_employees_count: number;
  };
};

export type CertificationsDataType = {
  id: string;
  name: string;
  certifications_count: number;
  assessed_employees_count: number;
  change_percentage: number;
};

export type CertificationsInsightsType = {
  data: {
    id: number;
    attributes: {
      name: string;
      description: string;
      skills: [];
      leaders?: CertificationLeaderDataType[];
      progress?: CertificationProgressDataType[];
    };
  };
};

export type CertificationLeaderDataType = {
  id: string;
  name: string;
  job_role: JobRoleType | null;
};

export type CertificationProgressDataType = {
  date: string;
  certified_employees_count: number;
};

export type CertificationProgessDataArgs = {
  id: string;
  from_date?: string;
  to_date?: string;
  select?: 'progress' | 'leaders';
};
