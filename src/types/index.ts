export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: string;
}

export interface Category {
  name: string;
  icon: string;
}

export const INCOME_CATEGORIES: Category[] = [
  { name: '工资', icon: '💰' },
  { name: '奖金', icon: '🎁' },
  { name: '投资', icon: '📈' },
  { name: '兼职', icon: '💼' },
  { name: '其他', icon: '💵' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { name: '餐饮', icon: '🍔' },
  { name: '交通', icon: '🚗' },
  { name: '购物', icon: '🛒' },
  { name: '娱乐', icon: '🎮' },
  { name: '医疗', icon: '💊' },
  { name: '教育', icon: '📚' },
  { name: '住房', icon: '🏠' },
  { name: '其他', icon: '📦' },
];

// 所有分类映射，方便查找
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// 获取分类图标
export const getCategoryIcon = (categoryName: string): string => {
  const category = ALL_CATEGORIES.find((c) => c.name === categoryName);
  return category?.icon || '💵';
};
