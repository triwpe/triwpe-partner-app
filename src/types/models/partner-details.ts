import exp from "constants";

export interface PartnerDetailCreateModel {
  businessType: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  registeredCountry: string;
  paymentCurrency: string;
}

export interface PartnerDetailCreatedModel {
  id: string;
  businessType: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  registeredCountry: string;
  paymentCurrency: string;
  createdAt: Date;
}

export interface PartnerDetailModel {
  id: string;
  businessType: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  registeredCountry: string;
  paymentCurrency: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ApiPartnerDetailCreateRequest {
  business_type: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  registered_country: string;
  payment_currency: string;
}

export interface ApiPartnerDetailCreateResponse {
  id: string;
  business_type: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  registered_country: string;
  payment_currency: string;
  created_at: Date;
}

export interface ApiPartnerDetailResponse {
  id: string;
  business_type: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  registered_country: string;
  payment_currency: string;
  created_at: Date;
  updated_at?: Date;
}