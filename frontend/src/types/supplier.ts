export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CreateSupplierDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
}
