export interface IPettySales {
  billNo: number;
  salesDate: Date;
  totalNetAmount: number;
  products: {
    serialNo: string;
    modelNo: string;
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
