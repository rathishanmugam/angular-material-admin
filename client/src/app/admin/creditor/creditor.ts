export interface ICreditor {
  _id: string;
  name: string;
  gstIM: string;
  address: {
    _id: string;
    street: string;
    city: string;
    state: string;
    zipCode: number;
  };
  email: string;
  phone1: string;
  phone2: string;
  mobile1: string;
  mobile2: string;
  createdOn: Date;
  added?: Date;
  action?: string;
}

export interface IAddress {
  _id: string;
  creditorId: string;
  customerId: string;
  street: string;
  city: string;
  state: string;
  zipCode: number;
}
