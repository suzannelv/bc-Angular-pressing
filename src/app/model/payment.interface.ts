export interface PaymentInterface {
  method: string;
  icon: string;
}

export interface PaymentResponse {
  'hydra:member': PaymentInterface[];
}
