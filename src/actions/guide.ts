'use server';

import { GuideCreateRequest, GuideResponse, GuideSectionCreateRequest, GuideSectionUpdateRequest, GuideUpdateRequest, SectionItemCreateRequest, SectionItemUpdateRequest } from "@/types/guide";
import * as partnerGuideApi from "@/services/api/partnerGuideApi";
import { ApiGuideSectionResponse, ApiGuideSectionUpdateRequest, GuideSectionModel, GuideSectionUpdateModel } from "@/types/models/guide-section";
import { ApiSectionItemUpdateRequest, SectionItemUpdateModel } from "@/types/models/section-item";
import { ApiGuideResponse, ApiGuideUpdateRequest, GuideModel, GuideUpdateModel } from "@/types/models/guides";
import { ApiMaptilerLocationResponse, MaptilerLocationModel } from "@/types/models/maptiler-location";
import { ApiGuideCategoryResponse, GuideCategoryModel } from "@/types/models/guide-category";

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function createGuide(title: string, location_id: string) {
  const data: GuideCreateRequest = {
    title: title as string,
    location_id: location_id as string,
  };

  try {
    const response = await partnerGuideApi.createGuide(data);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}



export async function createGuideSection(id: string, menu_title: string, full_title: string, description: string, is_visible_on_demo: boolean) {
  const data: GuideSectionCreateRequest = {
    menu_title: menu_title,
    full_title: full_title,
    description: description,
    is_visible_on_demo: is_visible_on_demo,
  };

  try {
    const response = await partnerGuideApi.createGuideSection(id, data);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}



//SECTION ITEM START
export async function createSectionItem(guide_section_id: string, title: string, description: string, is_visible_on_demo: boolean) {
  const data: SectionItemCreateRequest = {
    title: title,
    description: description,
    is_visible_on_demo: is_visible_on_demo,
  };

  try {
    const response = await partnerGuideApi.createSectionItem(guide_section_id, data);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}



export async function deleteSectionItem(guide_section_id: string, item_id: string) {
  try {
    const response = await partnerGuideApi.deleteSectionItem(guide_section_id, item_id);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
//SECTION ITEM END

export async function fetchGuide(id: string): Promise<ActionResponse<GuideModel>> {
  try {
    const response = await partnerGuideApi.getGuideById(id);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }
    
    const data: ApiGuideResponse = await response.json();   
    return { success: true, data: mapApiGuideResponseToModel(data) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function fetchGuides(): Promise<ActionResponse<GuideModel[]>> {
  try {
    const response = await partnerGuideApi.getGuides();

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }
    
    const data: ApiGuideResponse[] = await response.json();   
    return { success: true, data: data.map(mapApiGuideResponseToModel) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateGuide(guide_id: string, updated_data: GuideUpdateModel): Promise<ActionResponse<void>> {
  try {
    const data: ApiGuideUpdateRequest = mapGuideUpdateModelToApiRequest(updated_data);

    const response = await partnerGuideApi.updateGuide(guide_id, data);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function fetchGuideSections(id: string): Promise<ActionResponse<GuideSectionModel[]>> {
  try {
    const response = await partnerGuideApi.getGuideSections(id);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }
    
    const data: ApiGuideSectionResponse[] = await response.json();   
    return { success: true, data: data.map(mapApiGuideSectionResponseToModel) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateGuideSection(guide_id: string, section_id: string, updated_data: GuideSectionUpdateModel): Promise<ActionResponse<void>> {
  try {
    const data: ApiGuideSectionUpdateRequest = mapGuideSectionUpdateModelToApiRequest(updated_data);

    const response = await partnerGuideApi.updateGuideSection(guide_id, section_id, data);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteGuideSection(guide_id: string, section_id: string): Promise<ActionResponse<void>> {
  try {
    const response = await partnerGuideApi.deleteGuideSection(guide_id, section_id);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getSectionItems(guide_section_id: string) {
  try {
    const response = await partnerGuideApi.getSectionItems(guide_section_id);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateSectionItem(section_id: string, item_id: string, updated_data: SectionItemUpdateModel): Promise<ActionResponse<void>> {
  try {
    const data: ApiSectionItemUpdateRequest = mapSectionItemUpdateModelToApiRequest(updated_data);

    const response = await partnerGuideApi.updateSectionItem(section_id, item_id, data);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

const mapApiGuideResponseToModel = (data: ApiGuideResponse): GuideModel => {
  return {
    id: data.id,
    title: data.title,
    location: mapApiMaptilerLocationResponseToModel(data.location),
    description: data.description,
    duration: data.duration,
    price: data.price,
    language: data.language,
    categories: data.categories?.map(mapApiGuideCategoryResponseToModel),
    status: data.status,
    authorId: data.author_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

const mapApiMaptilerLocationResponseToModel = (data: ApiMaptilerLocationResponse): MaptilerLocationModel => {
  return {
    id: data.id,
    placeName: data.place_name,
    countryCode: data.country_code,
    latitude: data.latitude,
    longitude: data.longitude,
    placeType: data.place_type,
  };
}

const mapApiGuideCategoryResponseToModel = (data: ApiGuideCategoryResponse): GuideCategoryModel => {
  return {
    id: data.id,
    shortName: data.short_name,
    fullName: data.full_name,
    isMain: data.is_main,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
    
const mapGuideUpdateModelToApiRequest = (data: GuideUpdateModel): ApiGuideUpdateRequest => {
  return {
    title: data.title,
    description: data.description,
    duration: data.duration,
    price: data.price,
    language: data.language,
  };
}    

const mapApiGuideSectionResponseToModel = (data: ApiGuideSectionResponse): GuideSectionModel => {
  return {
    id: data.id,
    guideId: data.guide_id,
    menuTitle: data.menu_title,
    fullTitle: data.full_title,
    description: data.description,
    isVisibleOnDemo: data.is_visible_on_demo,
    items: data.items.map((item) => ({
      id: item.id,
      guideSectionId: item.guide_section_id,
      title: item.title,
      description: item.description,
      isVisibleOnDemo: item.is_visible_on_demo,
      itemOrder: item.item_order,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })),
    sectionOrder: data.section_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

const mapGuideSectionUpdateModelToApiRequest = (data: GuideSectionUpdateModel): ApiGuideSectionUpdateRequest => {
  return {
    menu_title: data.menuTitle,
    full_title: data.fullTitle,
    description: data.description,
    is_visible_on_demo: data.isVisibleOnDemo,
  };
}

const mapSectionItemUpdateModelToApiRequest = (data: SectionItemUpdateModel): ApiSectionItemUpdateRequest => {
  return {
    title: data.title,
    description: data.description,
    is_visible_on_demo: data.isVisibleOnDemo,
  };
}