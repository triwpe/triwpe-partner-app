'use server';

import * as maptilerApi from "@/services/api/maptilerApi";
import * as partnerGuideApi from "@/services/api/partnerGuideApi";
import { MaptilerLocationCreateRequest } from "@/types/location";

export async function getLocation(text: string) {
  try {
    const res = await maptilerApi.getLocation(text);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return res.json();
  } catch (error: any) {
    throw new Error(error.detail || "Something went wrong");
  }
}

export async function createMaptilerLocation(maptiler_id: string, feature: string) {
  const data: MaptilerLocationCreateRequest = {
    maptiler_id: maptiler_id as string,
    feature: feature as string,
  }

  partnerGuideApi.createMaptilerLocation(data);
};