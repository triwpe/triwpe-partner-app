export interface GuideCategoryModel {
  id: string;
  shortName: string;
  fullName: string;
  isMain: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ApiGuideCategoryResponse {
  id: string;
  short_name: string;
  full_name: string;
  is_main: boolean;
  created_at: Date;
  updated_at?: Date;
}