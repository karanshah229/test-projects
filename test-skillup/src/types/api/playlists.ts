import { ModuleStatusType } from '../common';

export type UpdateSkillLearningPlaylistArgs = {
  playListID: number;
  resource_id: number;
  status: ModuleStatusType;
};

export type PlayListResponse = {
  data: PlayListData;
};

export type PlayListData = {
  id: number;
  attributes: PlayListAttributes;
};

export type PlayListAttributes = {
  resource_id: number;
  status: ModuleStatusType;
  title: string;
  completed_at: Date;
};
