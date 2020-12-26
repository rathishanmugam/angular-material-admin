export interface IPurchase {
  purchaseBillNo: number;
  purchaseDate: Date;
  productCreditor: string;
  creditorGstIM?: string;
  creditorAddress?: string;
  creditorPhoneNo?: string;
  creditorMobileNo?: string;
  creditorEmail?: string;
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

}
