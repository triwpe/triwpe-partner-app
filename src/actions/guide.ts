'use server';

import { GuideCreateRequest, GuideResponse, GuideSectionCreateRequest, GuideSectionUpdateRequest, GuideUpdateRequest } from "@/types/guide";
import * as partnerGuideApi from "@/services/api/partnerGuideApi";


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

export async function getGuide(id: string) {
  try {
    const response = await partnerGuideApi.getGuide(id);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateGuide(id: string, title?: string, description?: string, duration?: number, price?: number, language?: string, status?: string) {
  const data: GuideUpdateRequest = {
    title: title,
    description: description,
    duration: duration,
    price: price,
    language: language,
    status: status,
  }
   
  try {
    const response = await partnerGuideApi.updateGuide(id, data);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
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

export async function getGuideSections(id: string) {
  try {
    const response = await partnerGuideApi.getGuideSections(id);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateGuideSection(id: string, section_id: string, menu_title?: string, full_title?: string, description?: string, is_visible_on_demo?: boolean) {
  const data: GuideSectionUpdateRequest = {
    menu_title: menu_title,
    full_title: full_title,
    description: description,
    is_visible_on_demo: is_visible_on_demo,
  };

  try {
    const response = await partnerGuideApi.updateGuideSection(id, section_id, data);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteGuideSection(id: string, section_id: string) {
  try {
    const response = await partnerGuideApi.deleteGuideSection(id, section_id);
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}