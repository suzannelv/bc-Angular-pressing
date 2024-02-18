import { MaterialsInterface } from './materials.interface';
import { ProductInterface } from './product.interface';
import { ServiceOptionsInterface } from './serviceOptions.interface';

export interface ProductSelectedInterface {
  product: ProductInterface;
  material: MaterialsInterface;
  serviceOptions: ServiceOptionsInterface;
  totalPrice: number;
  quantity: number;
}

export interface ProductSelectedResponse {
  'hydra:member': ProductSelectedInterface[];
}
