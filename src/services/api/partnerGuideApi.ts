'use server';

import { MaptilerLocationCreateRequest } from "@/types/location";
import { GuideCategoryUpsertRequest, GuideCreateRequest, GuideSectionCreateRequest, GuideSectionUpdateRequest, GuideUpdateRequest, SectionItemCreateRequest, SectionItemUpdateRequest } from "@/types/guide";
import { auth } from "@/auth";
import { ApiGuideSectionCreateRequest, ApiGuideSectionUpdateRequest, GuideSectionUpdateModel } from "@/types/models/guide-section";
import { ApiSectionItemUpdateRequest } from "@/types/models/section-item";
import { ApiGuideUpdateRequest } from "@/types/models/guides";

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

const createSectionItem = async (section_id: string, data: SectionItemCreateRequest) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/sections/${section_id}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

const getSectionItems = async (section_id: string) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/sections/${section_id}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}



const deleteSectionItem = async (section_id: string, item_id: string) => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/sections/${section_id}/items/${item_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}







//NEW
const getGuideById = async (guide_id: string): Promise<Response> => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${guide_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
};

const updateGuide = async (guide_id: string, data: ApiGuideUpdateRequest): Promise<Response> => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${guide_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

const getGuideSections = async (guide_id: string): Promise<Response> => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${guide_id}/sections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
};

const updateGuideSection = async (guide_id: string, section_id: string, data: ApiGuideSectionUpdateRequest): Promise<Response> => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${guide_id}/sections/${section_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

const deleteGuideSection = async (guide_id: string, section_id: string): Promise<Response>  => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/${guide_id}/sections/${section_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}

const updateSectionItem = async (section_id: string, item_id: string, data: ApiSectionItemUpdateRequest): Promise<Response> => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides/sections/${section_id}/items/${item_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

const getGuides = async (): Promise<Response> => {
  const session = await auth();

  const response = await fetch(`${API_BASE_URL}/v1/guides`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
};

export { createGuide, createMaptilerLocation, getGuideById, updateGuide, getCategories, updateGuideCategory, deleteGuideCategory, getGuideSections, createGuideSection, updateGuideSection, deleteGuideSection, createSectionItem, getSectionItems, updateSectionItem, deleteSectionItem, getGuides };


