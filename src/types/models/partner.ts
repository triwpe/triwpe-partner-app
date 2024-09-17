import { ApiPartnerDetailCreateRequest, ApiPartnerDetailCreateResponse, ApiPartnerDetailResponse, PartnerDetailCreatedModel, PartnerDetailCreateModel, PartnerDetailModel } from "./partner-details";


export interface PartnerCreateModel {
  email: string;
  password: string;
  detail: PartnerDetailCreateModel;
}

export interface PartnerCreatedModel {
  id: string;
  email: string;
  emailConfirmedAt: Date;
  detail: PartnerDetailCreatedModel;
  createdAt: Date;
}

export interface PartnerModel {
  id: string;
  email: string;
  emailConfirmedAt?: Date;
  detail: PartnerDetailModel;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ApiPartnerCreateRequest {
  email: string;
  password: string;
  detail: ApiPartnerDetailCreateRequest;
}

export interface ApiPartnerCreateResponse {
  id: string;
  email: string;
  email_confirmed_at: Date;
  detail: ApiPartnerDetailCreateResponse;
  created_at: Date;
}

export interface ApiPartnerResponse {
  id: string;
  email: string;
  email_confirmed_at?: Date;
  detail: ApiPartnerDetailResponse;
  created_at: Date;
  updated_at?: Date;
}