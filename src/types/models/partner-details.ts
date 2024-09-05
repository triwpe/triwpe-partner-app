export interface PartnerDetailsModel {
  email: string;
  password: string;
}

export interface PartnerDetailsCreateModel {
  businessType: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  registeredCountry: string;
  paymentCurrency: string;
}

export interface PartnerDetailsCreatedModel {
  email: string;
  password: string;
}