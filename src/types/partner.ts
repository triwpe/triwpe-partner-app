export interface PartnerLoginRequest {
  email: string;
  password: string;
}

export interface PartnerCreateRequest {
  email: string;
  password: string;
}

export interface PartnerCreateResponse {
  id: string;
  email: string;
  email_confirmed_at: string;
  created_at: string;
}

export interface PartnerPasswordResetRequest {
  email: string;
  token: string;
  new_password: string;
}

export interface VerifyTokenRequest {
  email: string;
  token: string;
}