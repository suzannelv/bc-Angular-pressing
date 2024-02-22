export interface PaymentInterface {
  method: string;
}

export interface PaymentResponse {
  'hydra:member': PaymentInterface[];
}
