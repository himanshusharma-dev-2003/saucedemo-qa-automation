export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  password?: string;
  email: string;
  phone: string;
  address: Address;
  company: Company;
  uuid: string;
  createdAt: Date;
}
