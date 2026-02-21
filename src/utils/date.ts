import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: string | Date): string => {
  return format(new Date(date), 'MM月dd日');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
};

export const isInCurrentMonth = (date: string): boolean => {
  const now = new Date();
  const targetDate = new Date(date);
  return isWithinInterval(targetDate, {
    start: startOfMonth(now),
    end: endOfMonth(now),
  });
};

export const isInCurrentYear = (date: string): boolean => {
  const now = new Date();
  const targetDate = new Date(date);
  return isWithinInterval(targetDate, {
    start: startOfYear(now),
    end: endOfYear(now),
  });
};

// 导出日期函数供 hooks 使用
export { startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval };
