export interface ServiceOptionsInterface {
  id: number;
  name: string;
  coefficentPrice: number;
}

export interface OptionsResponse {
  'hydra:member': ServiceOptionsInterface[];
}
