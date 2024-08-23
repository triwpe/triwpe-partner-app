export interface SectionItemModel {
  id: string; 
  guideSectionId: string;
  title?: string;
  description: string;
  isVisibleOnDemo: boolean;
  itemOrder: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SectionItemCreateModel {
  title: string;  
  description?: string;
  isVisibleOnDemo: boolean;
}

export interface SectionItemCreatedModel {
  id: string;
  title: string;
  description?: string;
  isVisibleOnDemo: boolean;
  createdAt: Date;
}

export interface SectionItemUpdateModel {
  title?: string;
  description?: string;
  isVisibleOnDemo?: boolean;
}

export interface ApiSectionItemResponse {
    id: string;
    guide_section_id: string;
    title?: string;
    description: string;
    is_visible_on_demo: boolean;
    item_order: number;
    created_at: Date;
    updated_at?: Date;
}

export interface ApiSectionItemCreateRequest {
    title: string;
    description?: string;
    is_visible_on_demo: boolean;
}

export interface ApiSectionItemCreateResponse {
    id: string;
    title: string;
    description?: string;
    is_visible_on_demo: boolean;
    created_at: Date;
}

export interface ApiSectionItemUpdateRequest {
    title?: string;
    description?: string;
    is_visible_on_demo?: boolean;
}

