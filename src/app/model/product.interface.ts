import { CategoryInterface } from './category.interface';
import { ProductStatusInterface } from './productStatus.interface';

export interface ProductInterface {
  id: number;
  name: string;
  category: CategoryInterface;
  price: number;
  description: string;
  productStatus: ProductStatusInterface;
  imagePath: string;
}
