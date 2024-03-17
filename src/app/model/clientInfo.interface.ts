export interface ClientInfo {
  '@id': string;
  id: number | null;
  clientNumber: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  adress: string;
  zipCodeIRI: string;
  zipCode: {
    zipCode: string;
    city: string;
  };
}
