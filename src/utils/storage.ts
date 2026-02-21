import { Transaction } from '../types';

const STORAGE_KEY = 'accounting_transactions';

export const storage = {
  getTransactions: (): Transaction[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  addTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    transactions.push(transaction);
    storage.saveTransactions(transactions);
  },

  deleteTransaction: (id: string): void => {
    const transactions = storage.getTransactions().filter((t) => t.id !== id);
    storage.saveTransactions(transactions);
  },

  updateTransaction: (id: string, updates: Partial<Transaction>): void => {
    const transactions = storage.getTransactions().map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    storage.saveTransactions(transactions);
  },
};
