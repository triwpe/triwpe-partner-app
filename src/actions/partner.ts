'use server';

import { PartnerCreateRequest, PartnerLoginRequest, PartnerPasswordResetRequest, VerifyTokenRequest } from "@/types/partner";
import * as partnerAccountApi from "@/services/api/partnerAccountApi";
import { cookies } from 'next/headers';
import CookiesService from "@/lib/cookies";
import { ApiPartnerCreateRequest, ApiPartnerResponse, PartnerCreateModel, PartnerModel } from "@/types/models/partner";
import { ApiPartnerDetailCreateRequest, ApiPartnerDetailResponse, PartnerDetailCreateModel, PartnerDetailModel } from "@/types/models/partner-details";
import { map } from "zod";

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function signIn(email: string, password: string): Promise<ActionResponse<void>> {
  const partnerCredentials: PartnerLoginRequest = { email, password };
  
  const signInResponse = await partnerAccountApi.signInPartnerAccount(partnerCredentials);
  
  if (!signInResponse.ok) {    
    if (signInResponse.status === 403) {
      return { success: false, error: 'EMAIL_NOT_VERIFIED', message: "Email not verified." };   
    }

    return { success: false, error: 'INVALID_CREDENTIALS', message: "Incorrect username or password." };  
  }

  const signInData = await signInResponse.json(); 

  await CookiesService.createAuthToken(signInData.access_token);

  return { 
    success: true
  }
}

export async function signOut() {
  await CookiesService.destroyAuthToken();
}

export async function confirmEmail(email: string, token: string) {
  const data: VerifyTokenRequest = {
    email: email as string,
    token: token as string,
  };

  try {
    const res = await partnerAccountApi.confirmEmail(data);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function resendEmailConfirmation(email: string) {
  try {
    const res = await partnerAccountApi.resendEmailConfirmation(email);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function resetPassword(email: string) {
  try {
    const res = await partnerAccountApi.resetPassword(email);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function confirmResetPasswordCode(email: string, token: string) {
  const data: VerifyTokenRequest = {
    email: email as string,
    token: token as string,
  };

  try {
    const res = await partnerAccountApi.confirmResetPasswordCode(data);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updatePassword(
  email: string,
  token: string,
  password: string,
) {
  const data: PartnerPasswordResetRequest = {
    email: email as string,
    token: token as string,
    new_password: password as string,
  };

  try {
    const res = await partnerAccountApi.updatePassword(data);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ***** NEW *****
export async function signUp(data: PartnerCreateModel): Promise<ActionResponse<void>> {
  try {
  const apiData: ApiPartnerCreateRequest = mapPartnerCreateModelToApiRequest(data);

  const response = await partnerAccountApi.createPartnerAccount(apiData);

  if (!response.ok) {
    const errorData = await response.json();
    return { success: false, message: errorData.detail || "Something went wrong" };
  }

  return { success: true };

  } catch (error: any) {
    return { success: false, message: error.message };
  }  
}

export async function getLoggedPartner(): Promise<ActionResponse<PartnerModel>> {
  try {
    const response = await partnerAccountApi.getLoggedPartner();

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Something went wrong" };
    }

    const data = await response.json();
    return { success: true, data: mapApiPartnerResponseToModel(data) };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

const mapPartnerCreateModelToApiRequest = (data: PartnerCreateModel): ApiPartnerCreateRequest => {
  return {
    email: data.email,
    password: data.password,
    detail: mapPartnerDetailCreateModelToApiRequest(data.detail),
  };
}

const mapPartnerDetailCreateModelToApiRequest = (data: PartnerDetailCreateModel): ApiPartnerDetailCreateRequest => {
  return {
    business_type: data.businessType,
    company_name: data.companyName,
    first_name: data.firstName,
    last_name: data.lastName,
    registered_country: data.registeredCountry,
    payment_currency: data.paymentCurrency,
  };
}

const mapApiPartnerResponseToModel = (data: ApiPartnerResponse): PartnerModel => {
  return {
    id: data.id,
    email: data.email,
    emailConfirmedAt: data.email_confirmed_at,
    detail: mapApiPartnerDetailResponseToModel(data.detail),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

const mapApiPartnerDetailResponseToModel = (data: ApiPartnerDetailResponse): PartnerDetailModel => {
  return {
    id: data.id,
    businessType: data.business_type,
    companyName: data.company_name,
    firstName: data.first_name,
    lastName: data.last_name,
    registeredCountry: data.registered_country,
    paymentCurrency: data.payment_currency,
    createdAt: data.created_at,
  };
}