import { ApiGuideCategoryResponse, GuideCategoryModel } from "./guide-category";
import { ApiMaptilerLocationResponse, MaptilerLocationModel } from "./maptiler-location";

    
export interface GuideModel {  
  id: string;
  title: string;
  location: MaptilerLocationModel;
  description?: string;
  duration?: number;
  price?: number;
  language?: string;
  categories?: GuideCategoryModel[];
  status: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ApiGuideResponse {
  id: string;
  title: string;
  location: ApiMaptilerLocationResponse;
  description?: string;
  duration?: number;
  price?: number;
  language?: string;
  categories?: ApiGuideCategoryResponse[];
  status: string;
  author_id: string;
  created_at: Date;
  updated_at?: Date;
}