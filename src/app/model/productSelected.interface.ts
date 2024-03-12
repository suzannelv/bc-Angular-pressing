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

export interface CreateProductSelectedInterface {
  id: number;
  uniqueId: string;
  product: string;
  productName: string;
  material: string;
  materialCoefficent: number;
  serviceOptions: string[];
  serviceCoefficent: number[];
  quantity: number;
  price: number;
  imagePath: string;
}

export interface CartProductSelectedInterface
  extends CreateProductSelectedInterface {}
