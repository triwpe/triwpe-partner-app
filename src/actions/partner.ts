'use server';

import { PartnerCreateRequest, PartnerLoginRequest, PartnerPasswordResetRequest, VerifyTokenRequest } from "@/types/partner";
import * as partnerAccountApi from "@/services/api/partnerAccountApi";
import { cookies } from 'next/headers';
import CookiesService from "@/lib/cookies";

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

export async function signUp(email: string, password: string) {
  const newPartner: PartnerCreateRequest = {
    email: email as string,
    password: password as string,
  };

  try {
    const res = await partnerAccountApi.createPartnerAccount(newPartner);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Something went wrong");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
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

export async function getCurrentPartner() {
  try {
    const partnerResponse = await partnerAccountApi.getPartnerInfo();
    if (!partnerResponse || !partnerResponse.ok) {
      return null;
    }
    const partnerData = await partnerResponse.json();
    return partnerData;
  } catch (error) {
    return null;
  }
}