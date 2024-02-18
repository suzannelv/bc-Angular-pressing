export interface ServiceOptionsInterface {
  name: string;
  coefficentPrice: number;
}

export interface OptionsResponse {
  'hydra:member': ServiceOptionsInterface[];
}
