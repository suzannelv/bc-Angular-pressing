export interface MaterialsInterface {
  name: string;
  coefficentPrice: number;
  productSelecteds?: any[];
}

export interface MaterialResponse {
  'hydra:member': MaterialsInterface[];
}
