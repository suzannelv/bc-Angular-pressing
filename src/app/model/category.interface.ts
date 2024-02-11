export interface CategoryInterface {
  '@id': string;
  id: number;
  name: string;
  parent?: string;
  child?: CategoryInterface[];
  products?: string[];
}
export interface CategoryResponse {
  'hydra:member': CategoryInterface[];
}
