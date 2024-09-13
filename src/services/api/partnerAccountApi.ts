'use server';

import CookiesService from "@/lib/cookies";
import { PartnerLoginRequest, PartnerCreateRequest, VerifyTokenRequest, PartnerPasswordResetRequest } from "@/types/partner";
import { Cookie } from "next/font/google";
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_TRIWPE_PARTNER_API_URL;

const signInPartnerAccount = async (data: PartnerLoginRequest) => {
  const response = await fetch(`${API_BASE_URL}/v1/partners/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: data.email,
      password: data.password,
    }),
  });
  return response;
};

const createPartnerAccount = async (data: PartnerCreateRequest) => {
  const response = await fetch(`${API_BASE_URL}/v1/partners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  return response;
};

const getPartner = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/v1/partners/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getPartnerInfo = async() => {
  const access_token = await CookiesService.getAuthToken();
  if (!access_token) {
    return null;
  } 
  
  const res = await fetch(`${API_BASE_URL}/v1/partners/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });  
  return res;
};



const confirmEmail = async (data: VerifyTokenRequest) => {
  const response = await fetch(`${API_BASE_URL}/v1/partners/email/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

const resendEmailConfirmation = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/v1/partners/email/resend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return response;
};

const resetPassword = async (email: string) => {
  const response = await fetch(
    `${API_BASE_URL}/v1/partners/password-reset/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );
  return response;
};

const confirmResetPasswordCode = async (data: VerifyTokenRequest) => {
  const res = await fetch(`${API_BASE_URL}/v1/partners/password-reset/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res;
};

const updatePassword = async (data: PartnerPasswordResetRequest) => {
  const res = await fetch(`${API_BASE_URL}/v1/partners/password-reset`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res;
};

export { signInPartnerAccount, getPartner, createPartnerAccount, confirmEmail, resendEmailConfirmation, resetPassword, confirmResetPasswordCode, updatePassword, getPartnerInfo };

