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

export interface CreateProductSelectedInterface {
  product: string;
  productName: string;
  material: string;
  serviceOptions: string[];
  quantity: number;
  price: number;
  imagePath: string;
}

export interface CartProductSelectedInterface
  extends CreateProductSelectedInterface {}

export interface ProductSelectedResponse {
  'hydra:member': ProductSelectedInterface[];
}
