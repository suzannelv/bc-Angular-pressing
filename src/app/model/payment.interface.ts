export interface PaymentInterface {
  '@id': string;
  id: number;
  method: string;
  icon: string;
}

export interface PaymentResponse {
  'hydra:member': PaymentInterface[];
}
