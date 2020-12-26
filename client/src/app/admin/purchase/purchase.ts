export interface IPurchase {
  purchaseBillNo: number;
  purchaseDate: Date;
  productCreditor: string;
  creditorGstIM: string;
  creditorAddress: string;
  creditorPhoneNo: string;
  creditorMobileNo: string;
  creditorEmail: string;
  products: {
    serialNo: string;
    modelNo: string;
    HSNCodeNo: string;
    companyName: string;
    productType: string;
    qty: number;
    productRate: number;
    gstRate: number;
    sgstRate: number;
    totalRate: number;
  };
}

export interface IAccount {
  accountNo?: number;
  particulars: string;
  debit: number;
  credit: number;
  createdOn?: Date;
  action?: string;
}
