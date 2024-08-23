'use server';

import * as partnerGuideApi from "@/services/api/partnerGuideApi";
import { GuideCategoryUpsertRequest } from "@/types/guide";

export async function getCategories() {
  try {
    const res = await partnerGuideApi.getCategories();
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true, data: await res.json() };
  } catch (error: any) {
    throw new Error(error.detail || "Something went wrong");
  }
}

export async function updateGuideCategory(id: string, category_id: string, is_main: boolean, old_main_category_id?: string) {
  const data: GuideCategoryUpsertRequest = {
    category_id: category_id,
    is_main: is_main,
    old_category_id: old_main_category_id,
  };  

  try {    
    const res = await partnerGuideApi.updateGuideCategory(id, data);
    if (!res.ok) {
      const errorData = await res.json();  
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    throw new Error(error.detail || "Something went wrong");
  }
}


export async function deleteGuideCategory(id: string, category_id: string) {
  try {
    const res = await partnerGuideApi.deleteGuideCategory(id, category_id);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    throw new Error(error.detail || "Something went wrong");
  }
}