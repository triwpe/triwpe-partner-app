'use server';

import * as partnerGuideApi from "@/services/api/partnerGuideApi";
import { ApiCloudinaryImageResponse, CloudinaryImageModel } from "@/types/models/images";

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function uploadImage(formData: FormData): Promise<ActionResponse<void>> {
  try {
    console.log('2. formData', formData);
    const res = await partnerGuideApi.uploadImage(formData);
    console.log('4. res', res);
    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function fetchImages(asset_folder: string): Promise<ActionResponse<CloudinaryImageModel[]>> {
  try {
    const response = await partnerGuideApi.getImages(asset_folder);
    console.log('response', response);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }
    
    const data: ApiCloudinaryImageResponse[] = await response.json();   
    console.log('data', data);
    console.log('data.length', data.length);
    console.log('data', data.length > 0 ? data.map(mapApiCloudinaryImageResponseToModel) : []);

    return { success: true, data: data.length > 0 ? data.map(mapApiCloudinaryImageResponseToModel) : [] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteImage(public_id: string): Promise<ActionResponse<void>> {
  try {
    const response = await partnerGuideApi.deleteImage(public_id);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

const mapApiCloudinaryImageResponseToModel = (data: ApiCloudinaryImageResponse): CloudinaryImageModel => {
  return {
    publicId: data.public_id,
    assetFolder: data.asset_folder,
  };
}