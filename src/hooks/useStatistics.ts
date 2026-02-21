import { useMemo } from 'react';
import { Transaction } from '../types';
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from '../utils/date';

export type PeriodType = 'month' | 'year';

export interface StatisticsData {
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryStatistics {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export const useStatistics = (
  transactions: Transaction[],
  period: PeriodType = 'month'
) => {
  const stats = useMemo(() => {
    const now = new Date();
    const startDate =
      period === 'month' ? startOfMonth(now) : startOfYear(now);
    const endDate = period === 'month' ? endOfMonth(now) : endOfYear(now);

    const filteredTransactions = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start: startDate, end: endDate })
    );

    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions, period]);

  return stats;
};

export const useCategoryStatistics = (
  transactions: Transaction[],
  period: PeriodType = 'month',
  type: 'income' | 'expense' = 'expense'
) => {
  const categoryStats = useMemo(() => {
    const now = new Date();
    const startDate =
      period === 'month' ? startOfMonth(now) : startOfYear(now);
    const endDate = period === 'month' ? endOfMonth(now) : endOfYear(now);

    const filteredTransactions = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start: startDate, end: endDate })
    );

    const typeTransactions = filteredTransactions.filter(
      (t) => t.type === type
    );

    // 按分类汇总
    const categoryMap = new Map<string, number>();
    typeTransactions.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

    // 预定义颜色
    const colors = [
      '#3B82F6', // blue-500
      '#10B981', // green-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#8B5CF6', // violet-500
      '#EC4899', // pink-500
      '#06B6D4', // cyan-500
      '#F97316', // orange-500
    ];

    const categories: CategoryStatistics[] = Array.from(
      categoryMap.entries()
    )
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categories, total };
  }, [transactions, period, type]);

  return categoryStats;
};
