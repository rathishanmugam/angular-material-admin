export interface ISales {
  billNo: number;
  salesDate: Date;
  customerName: string;
  address: string;
  phoneNo: string;
  email: string;
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
  totalNetAmount: number;
  billType: string;
  financeName?: string;
  delivered: boolean;
  credit: {
    billNo: number;
    creditNo: number;
    initialAmountPaid?: number;
    loanAmount?: number;
    loanTenure?: number;
    loanInterest?: number;
    EMIPerMonth?: number;
    totalInterestPayable?: number;
    totalAmountPayable?: number;
    duePayableDate?: Date;
    totalPayableDues?: number;
    dueEndYear?: Date;
    currentDue: Date;
    betweenDues?: string[];
    duePending: number;
    creditDue: [{
      billNo: number;
      customerName: string;
      creditNo: number;
      dueAmount: number;
      dueStartDate: Date;
      dueEndDate: Date;
      dueCurrentDate: Date;
      gracePeriod: number;
      duePaid: boolean;
    }]
  };
}

export interface ICredit {
  billNo: number;
  creditNo: number;
  initialAmountPaid?: number;
  loanAmount?: number;
  loanTenure?: number;
  loanInterest?: number;
  EMIPerMonth?: number;
  totalInterestPayable?: number;
  totalAmountPayable?: number;
  duePayableDate?: Date;
  totalPayableDues?: number;
  dueEndYear?: Date;
  currentDue: Date;
  betweenDues?: string[];
  creditDue: [{
    billNo: number;
    customerName: string;
    creditNo: number;
    dueAmount: number;
    dueStartDate: Date;
    dueEndDate: Date;
    dueCurrentDate: Date;
    gracePeriod: number;
    duePaid: boolean;
  }]
}


export interface ICreditDue {
  billNo: number;
  customerName: string;
  creditNo: number;
  dueAmount: number;
  dueStartDate: Date;
  dueEndDate: Date;
  dueCurrentDate: Date;
  gracePeriod: number;
  duePaid: boolean;
}
