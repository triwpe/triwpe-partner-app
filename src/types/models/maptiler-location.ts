export interface MaptilerLocationModel {
  id: string;
  placeName: string;
  CountryCode: string;
  Latitude: number;
  Longitude: number;
  PlaceType: string;
}

export interface ApiMaptilerLocationResponse {
  id: string;
  place_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  place_type: string;
}