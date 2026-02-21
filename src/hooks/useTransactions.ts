import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { storage } from '../utils/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(storage.getTransactions());
  }, []);

  const addTransaction = (transaction: Transaction) => {
    storage.addTransaction(transaction);
    setTransactions(storage.getTransactions());
  };

  const deleteTransaction = (id: string) => {
    storage.deleteTransaction(id);
    setTransactions(storage.getTransactions());
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    storage.updateTransaction(id, updates);
    setTransactions(storage.getTransactions());
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};
