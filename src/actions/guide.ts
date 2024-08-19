'use server';

import { GuideCreateRequest, GuideResponse } from "@/types/guide";
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