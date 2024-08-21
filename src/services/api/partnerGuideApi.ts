'use server';

import { MaptilerLocationCreateRequest } from "@/types/location";
import { GuideCategoryUpsertRequest, GuideCreateRequest, GuideSectionCreateRequest, GuideSectionUpdateRequest, GuideUpdateRequest } from "@/types/guide";
import { auth } from "@/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_TRIWPE_PARTNER_GUIDE_API_URL;


const createMaptilerLocation = async (data: MaptilerLocationCreateRequest) => {
  await fetch(`${API_BASE_URL}/v1/locations/maptiler`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const createGuide = async (data: GuideCreateRequest) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",     
      Authorization: `Bearer ${session?.accessToken}`,    
    },
    body: JSON.stringify({
      title: data.title,
      location_id: data.location_id,
    }),
  });

  return response;
};

const getGuide = async (id: string) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}

const updateGuide = async (id: string, data: GuideUpdateRequest) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

const createGuideSection = async (id: string, data: GuideSectionCreateRequest) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

const getGuideSections = async (id: string) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}/sections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}

const updateGuideSection = async (id: string, section_id: string, data: GuideSectionUpdateRequest) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}/sections/${section_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

const deleteGuideSection = async (id: string, section_id: string) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}/sections/${section_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}

const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

const updateGuideCategory = async (id: string, data: GuideCategoryUpsertRequest) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}/categories`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
};

const deleteGuideCategory = async (id: string, category_id: string) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${id}/categories/${category_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}

export { createGuide, createMaptilerLocation, getGuide, updateGuide, getCategories, updateGuideCategory, deleteGuideCategory, getGuideSections, createGuideSection, updateGuideSection, deleteGuideSection };


