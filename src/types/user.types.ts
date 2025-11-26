export interface UserData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

export interface AccountInfo {
  accountId: string;
  accountType: string;
  balance: string;
}

export interface TransactionData {
  id: number;
  accountId: number;
  type: string;
  date: string;
  amount: number;
  description: string;
}
