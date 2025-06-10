
import { useState, useCallback } from 'react';
import { Account, Transaction, ATMScreen } from '../types';

const STORAGE_KEYS = {
  ACCOUNTS: 'atm_accounts',
  TRANSACTIONS: 'atm_transactions',
};

export const useATM = () => {
  const [currentScreen, setCurrentScreen] = useState<ATMScreen>('welcome');
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [enteredCardNumber, setEnteredCardNumber] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Get accounts from localStorage
  const getAccounts = useCallback((): Account[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Save accounts to localStorage
  const saveAccounts = useCallback((accounts: Account[]) => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, []);

  // Get transactions from localStorage
  const getTransactions = useCallback((): Transaction[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Save transactions to localStorage
  const saveTransactions = useCallback((transactions: Transaction[]) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, []);

  // Add transaction
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const transactions = getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    transactions.push(newTransaction);
    saveTransactions(transactions);
  }, [getTransactions, saveTransactions]);

  // Create new account
  const createAccount = useCallback((holderName: string, initialPin: string) => {
    const accounts = getAccounts();
    const cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    
    const newAccount: Account = {
      id: Date.now().toString(),
      cardNumber,
      pin: initialPin,
      holderName,
      balance: 1000, // Starting balance
      createdAt: new Date(),
    };

    accounts.push(newAccount);
    saveAccounts(accounts);
    
    addTransaction({
      accountId: newAccount.id,
      type: 'deposit',
      amount: 1000,
      description: 'Account opening deposit',
    });

    return newAccount;
  }, [getAccounts, saveAccounts, addTransaction]);

  // Authenticate user
  const authenticateUser = useCallback((cardNumber: string, pin: string): Account | null => {
    const accounts = getAccounts();
    const account = accounts.find(acc => acc.cardNumber === cardNumber && acc.pin === pin);
    return account || null;
  }, [getAccounts]);

  // Withdraw cash
  const withdrawCash = useCallback((amount: number): boolean => {
    if (!currentAccount || currentAccount.balance < amount || amount <= 0) {
      return false;
    }

    const accounts = getAccounts();
    const updatedAccounts = accounts.map(acc => 
      acc.id === currentAccount.id 
        ? { ...acc, balance: acc.balance - amount }
        : acc
    );
    
    saveAccounts(updatedAccounts);
    setCurrentAccount(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    
    addTransaction({
      accountId: currentAccount.id,
      type: 'withdrawal',
      amount,
      description: `Cash withdrawal`,
    });

    return true;
  }, [currentAccount, getAccounts, saveAccounts, addTransaction]);

  // Change PIN
  const changePin = useCallback((newPin: string): boolean => {
    if (!currentAccount) return false;

    const accounts = getAccounts();
    const updatedAccounts = accounts.map(acc => 
      acc.id === currentAccount.id 
        ? { ...acc, pin: newPin }
        : acc
    );
    
    saveAccounts(updatedAccounts);
    setCurrentAccount(prev => prev ? { ...prev, pin: newPin } : null);
    
    addTransaction({
      accountId: currentAccount.id,
      type: 'pin_change',
      description: 'PIN changed successfully',
    });

    return true;
  }, [currentAccount, getAccounts, saveAccounts, addTransaction]);

  // Get account transactions
  const getAccountTransactions = useCallback((): Transaction[] => {
    if (!currentAccount) return [];
    const transactions = getTransactions();
    return transactions
      .filter(t => t.accountId === currentAccount.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [currentAccount, getTransactions]);

  // Reset session
  const resetSession = useCallback(() => {
    setCurrentAccount(null);
    setEnteredCardNumber('');
    setEnteredPin('');
    setWithdrawalAmount('');
    setNewPin('');
    setConfirmPin('');
    setCurrentScreen('welcome');
  }, []);

  return {
    // State
    currentScreen,
    currentAccount,
    enteredCardNumber,
    enteredPin,
    withdrawalAmount,
    newPin,
    confirmPin,
    
    // Actions
    setCurrentScreen,
    setCurrentAccount, // Added this missing function
    setEnteredCardNumber,
    setEnteredPin,
    setWithdrawalAmount,
    setNewPin,
    setConfirmPin,
    createAccount,
    authenticateUser,
    withdrawCash,
    changePin,
    getAccountTransactions,
    resetSession,
    
    // Utils
    addTransaction,
  };
};
