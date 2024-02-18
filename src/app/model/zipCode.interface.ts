export interface ZipCodeInterface {
  zipCode: string;
  city: string;
  country: string;
  '@id': string;
}

export interface ZipCodeResponse {
  'hydra:member': ZipCodeInterface[];
}
