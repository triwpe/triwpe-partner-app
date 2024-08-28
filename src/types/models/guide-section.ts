import { SectionItemModel, ApiSectionItemResponse } from "./section-item";

export interface GuideSectionModel {
  id: string;
  guideId: string;
  menuTitle: string;
  fullTitle: string;
  description?: string;
  isVisibleOnDemo: boolean;
  items: SectionItemModel[];
  sectionOrder: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GuideSectionCreateModel {
  menuTitle: string;
  fullTitle: string;
  description?: string;
  isVisibleOnDemo: boolean;
}

export interface GuideSectionCreatedModel {
  id: string;
  menuTitle: string;
  fullTitle: string;
  description?: string;
  isVisibleOnDemo: boolean;
  createdAt: Date;
}

export interface GuideSectionUpdateModel {
  menuTitle?: string;
  fullTitle?: string;
  description?: string;
  isVisibleOnDemo?: boolean;
}

export interface GuideSectionReorderModel {
  id: string;
  sectionOrder: number;
}

export interface ApiGuideSectionResponse {
  id: string;
  guide_id: string;
  menu_title: string;
  full_title: string;
  description?: string;
  is_visible_on_demo: boolean;
  items: ApiSectionItemResponse[];
  section_order: number;
  created_at: Date;
  updated_at?: Date;
}

export interface ApiGuideSectionCreateRequest {
  menu_title: string;
  full_title: string;
  description?: string;
  is_visible_on_demo: boolean;
}

export interface ApiGuideSectionCreateResponse {
  id: string;
  menu_title: string;
  full_title: string;
  description?: string;
  is_visible_on_demo: boolean; 
  created_at: Date;
}

export interface ApiGuideSectionReorderRequest{
  id: string;
  section_order: number;
}

export interface ApiGuideSectionUpdateRequest {
  menu_title?: string;
  full_title?: string;
  description?: string;
  is_visible_on_demo?: boolean;
}