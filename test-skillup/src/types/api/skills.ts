import { RatingCutoffs } from './common';
import { DifficultyType, ModuleStatusType, ProficiencyType } from '../common';

export type ContentType = 'website' | 'video';

export type BasicJobType = {
  id: string;
  name: string;
};

export type SkillsOverviewType = {
  data: {
    skills: SkillsDataType[];
    skills_count: number;
    skilled_employees_count: number;
  };
};

export type SkillsDataType = {
  id: string;
  name: string;
  count?: number;
  change_percentage?: number;
  proficiencies?: SkillsProficiencyType;
};

export type SortedSkillsDataType = {
  id: string;
  name: string;
  count: number;
  prebeginner: number;
  beginner: number;
  intermediate: number;
  expert: number;
};

export type SkillsProficiencyType = {
  prebeginner: ProficiencyChangeType;
  beginner: ProficiencyChangeType;
  intermediate: ProficiencyChangeType;
  expert: ProficiencyChangeType;
};

export type ProficiencyChangeType = {
  count: number;
  change_percentage: number;
};

export type SkillsInsightsType = {
  data: {
    leaders?: SkillLeaderDataType[];
    progress?: SkillProgressDataType[];
  };
};

export type SkillLeaderDataType = {
  id: string;
  name: string;
  proficiency: ProficiencyType;
  rating: number;
};

export type SkillProgressDataType = {
  date: string;
  proficiencies_count: {
    prebeginner: number;
    beginner: number;
    intermediate: number;
    expert: number;
  };
};

export type ProgessDataArgs = {
  id: string;
  from_date?: string;
  to_date?: string;
  select?: 'progress' | 'leaders';
};

export type SkillsPlaylistArgs = {
  skillId: string;
};

export type SkillsPlaylistType = {
  data: {
    playlists: SkillsPlaylistAttributeType[];
  };
};

export type SkillsPlaylistAttributeType = {
  id: number;
  proficiency: ProficiencyType;
  description: string;
  modules: SkillsModuleType[];
  practice_assessments: PracticeAssessmentsType[];
  badge_assessment: BadgeAssessmentType;
};

export type SkillsModuleType = {
  id: number;
  title: string;
  resources: ModuleResourceType[];
};

export type ModuleResourceType = {
  id: number;
  title: string;
  status: ModuleStatusType;
  duration: number;
  links: ResourceLinkType[];
};

export type ResourceLinkType = {
  link: string;
  content_type: ContentType;
};

export type PracticeAssessmentsType = {
  id: string;
  recruit_test_id: number;
  url: string;
  questions: PracticeAssessmentsQuestionsType[];
};

export type PracticeAssessmentsQuestionsType = {
  title: string;
  question_id: number;
  difficulty: DifficultyType;
};

export type BadgeAssessmentType = {
  id: number;
  recruit_test_id: number;
  url: string;
  cool_down_period: number;
  total_retries: number;
  duration: number;
  passing_score: number;
  questions_count: number;
  metadata: {
    description: string;
    criteria: string[];
  };
};

export type SkillsDirectoryDatum = {
  data: SkillsDirectoryData[];
};

export type SkillsDirectoryData = {
  id: string;
  attributes: SkillsDirectoryAttributes;
};

export type SkillsDirectoryAttributes = {
  name: string;
  slug: string;
  description: string;
  proficiency: ProficiencyType;
  proficiency_progress: ProficiencyProgress;
  popularity_index: number;
  rating: number;
  status: string;
  rating_cutoffs: RatingCutoffs;
  job_families: BasicJobType[];
  job_roles: BasicJobType[];
  bookmarked: boolean;
  recommended: boolean;
  popular: boolean;
};

interface ProficiencyProgressData {
  progress_percentage: number | null;
  latest_activity_at: string | null;
}

export type ProficiencyProgress = {
  beginner: ProficiencyProgressData;
  intermediate: ProficiencyProgressData;
  expert: ProficiencyProgressData;
};

export type SkillsDirectoryQueryArgs = {
  additional_attributes?: string;
  sort?: 'recent';
};
