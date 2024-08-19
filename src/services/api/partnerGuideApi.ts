'use server';

import { MaptilerLocationCreateRequest } from "@/types/location";
import { GuideCreateRequest } from "@/types/guide";
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

export { createGuide, createMaptilerLocation, getGuide };

