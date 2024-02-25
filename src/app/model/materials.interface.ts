export interface MaterialsInterface {
  '@id': string;
  id: number;
  name: string;
  coefficentPrice: number;
  productSelecteds?: any[];
}

export interface MaterialResponse {
  'hydra:member': MaterialsInterface[];
}
