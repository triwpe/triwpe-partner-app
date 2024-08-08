'use server';

import { PartnerCreateRequest, PartnerPasswordResetRequest, VerifyTokenRequest } from "@/types/partner";
import * as partnerAccountApi from "@/services/api/partnerAccountApi";


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