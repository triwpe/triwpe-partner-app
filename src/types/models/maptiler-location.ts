export interface MaptilerLocationModel {
  id: string;
  placeName: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  placeType: string;
}

export interface ApiMaptilerLocationResponse {
  id: string;
  place_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  place_type: string;
}