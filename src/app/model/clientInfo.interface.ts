export interface ClientInfo {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  adress: string;
  zipCode: {
    zipCode: string;
    city: string;
  };
}
