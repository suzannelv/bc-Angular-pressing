import { CategoryInterface } from './category.interface';
import { ProductStatusInterface } from './productStatus.interface';

export interface ProductInterface {
  '@id': string;
  id: number;
  name: string;
  category: CategoryInterface;
  price: number;
  description: string;
  productStatus: ProductStatusInterface;
  imagePath: string;
  contentUrl: string;
}

export interface ProductResponse {
  'hydra:member': ProductInterface[];
  'hydra:view': {
    'hydra:first': string;
    'hydra:last': string;
    'hydra:next'?: string;
  };
}
