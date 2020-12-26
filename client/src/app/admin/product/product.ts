export interface IProduct {
  serialNo: string;
  modelNo: string;
  HSNCodeNo: string;
  companyName: string;
  productType: string;
  qty: string;
  rate: number;
  gstRate: number;
  sgstRate: number;
  updatedOn: Date;
  added?: Date;
  action?: string;
}
