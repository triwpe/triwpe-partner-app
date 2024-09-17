import { ApiGuideCategoryResponse, GuideCategoryModel } from "./guide-category";
import { ApiMaptilerLocationResponse, MaptilerLocationModel } from "./maptiler-location";

    
export interface GuideModel {  
  id: string;
  title: string;
  location: MaptilerLocationModel;
  description?: string;
  duration?: number;
  currency: string;
  price?: number;
  language?: string;
  categories?: GuideCategoryModel[];
  status: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GuideUpdateModel{
  title?: string;
  description?: string;
  duration?: number;
  price?: number;
  language?: string;
  status?: string;
}

export interface ApiGuideResponse {
  id: string;
  title: string;
  location: ApiMaptilerLocationResponse;
  description?: string;
  duration?: number;
  currency: string;
  price?: number;
  language?: string;
  categories?: ApiGuideCategoryResponse[];
  status: string;
  author_id: string;
  created_at: Date;
  updated_at?: Date;
}

export interface ApiGuideUpdateRequest {
  title?: string;
  description?: string;
  duration?: number;
  price?: number;
  language?: string;
  status?: string;
}