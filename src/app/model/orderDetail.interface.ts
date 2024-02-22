import { OrderStatusInterface } from './orderStatus.interface';
import { PaymentInterface } from './payment.interface';
import { UserInterface } from './user.interface';

export interface OrderDetailInterface {
  id: number;
  depositDate: Date;
  retrieveDate: Date;
  orderNumber: string;
  payment: PaymentInterface;
  client: UserInterface;
  orderStatus: OrderStatusInterface;
}

export interface orderDetailResponse {
  'hydra:member': OrderDetailInterface[];
}
