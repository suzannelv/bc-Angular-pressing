export interface UserInterface {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthday?: Date | undefined;
  profilUrl?: string;
  phoneNumber: string;
  adress: string;
  zipCode: string;
}
