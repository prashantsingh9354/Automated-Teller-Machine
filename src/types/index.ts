
export interface Account {
  id: string;
  cardNumber: string;
  pin: string;
  holderName: string;
  balance: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'balance_inquiry' | 'pin_change';
  amount?: number;
  timestamp: Date;
  description: string;
}

export type ATMScreen = 
  | 'welcome'
  | 'insert_card'
  | 'enter_pin'
  | 'main_menu'
  | 'balance_inquiry'
  | 'cash_withdrawal'
  | 'pin_change'
  | 'transaction_history'
  | 'create_account'
  | 'receipt';
