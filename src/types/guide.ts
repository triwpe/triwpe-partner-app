export interface MaptilerLocationCreateRequest{
  maptiler_id: string;
  feature: string;
}

export interface GuideCreateRequest{
  title: string;
  location_id: string;
}

export interface GuideUpdateRequest{
  title?: string;
  description?: string;
  duration?: number;
  price?: number;
  language?: string;
  status?: string;
}

export interface GuideCategoryUpsertRequest{
  category_id: string;
  is_main: boolean;
  old_category_id?: string;
}

export interface GuideResponse{
  id: string;
  title: string;
  location_id: string;
  description?: string;
  duration?: number;
  price?: number;
  language?: string;
  status: string;
  author_id: string;
  created_at: Date;
  updated_at?: Date;
}

