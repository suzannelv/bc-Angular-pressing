export interface ServiceOptionsInterface {
  '@id': string;
  id: number;
  name: string;
  coefficentPrice: number;
}

export interface OptionsResponse {
  'hydra:member': ServiceOptionsInterface[];
}
