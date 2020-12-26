export interface IAccount {
  accountNo?: number;
  particulars: string;
  debit: number;
  credit: number;
  createdOn?: Date;
  action?: string;
}

export interface ITally {
  netDebit: number;
  netCredit: number;
  netTotal: number;
  createdOn?: Date;
}
