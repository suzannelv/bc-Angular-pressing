import { OrderStatusInterface } from './orderStatus.interface';
import { PaymentInterface } from './payment.interface';
import { ProductSelectedInterface } from './productSelected.interface';
import { UserInterface } from './user.interface';

export interface OrderDetailInterface {
  depositDate: Date;
  retrieveDate: Date;
  payment: string;
  client: string;
  emp: string;
  orderStatus: string;
  delivery: boolean;
  orderNumber?: string;
  createdAt?: Date;
  productSelected: any[];
}

export interface orderDetailResponse {
  'hydra:member': OrderDetailInterface[];
}
