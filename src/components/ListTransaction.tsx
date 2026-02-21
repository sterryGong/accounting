import { useState } from 'react';
import { Transaction } from '../types';
import { formatDisplayDate, formatCurrency } from '../utils/date';
import { getCategoryIcon } from '../types';
import { DeleteTransaction } from './DeleteTransaction';

interface ListTransactionProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

interface TransactionGroup {
  date: string;
  transactions: Transaction[];
}

// 按日期分组交易记录
const groupTransactionsByDate = (transactions: Transaction[]): TransactionGroup[] => {
  const groups: Record<string, Transaction[]> = {};

  transactions.forEach((transaction) => {
    if (!groups[transaction.date]) {
      groups[transaction.date] = [];
    }
    groups[transaction.date].push(transaction);
  });

  return Object.entries(groups)
    .map(([date, transactions]) => ({
      date,
      transactions,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// 计算单日收支汇总
const calculateDaySummary = (transactions: Transaction[]) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expense };
};

// 格式化日期显示
const formatGroupDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 重置时间部分以便比较
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return '今天';
  }
  if (compareDate.getTime() === yesterday.getTime()) {
    return '昨天';
  }

  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

export const ListTransaction = ({ transactions, onDelete }: ListTransactionProps) => {
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 按日期分组并排序
  const groupedTransactions = groupTransactionsByDate(transactions);

  const handleDeleteClick = (transaction: Transaction) => {
    setDeleteTarget(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete?.(deleteTarget.id);
    }
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">暂无记录</p>
        <p className="text-gray-400 text-sm mt-2">点击"添加"按钮记录第一笔收支</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {groupedTransactions.map((group) => {
          const summary = calculateDaySummary(group.transactions);

          return (
            <div key={group.date}>
              {/* 日期头部 */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-medium text-gray-600">
                  {formatGroupDate(group.date)}
                </h3>
                <div className="flex gap-3 text-sm">
                  {summary.income > 0 && (
                    <span className="text-green-600">
                      收: {formatCurrency(summary.income)}
                    </span>
                  )}
                  {summary.expense > 0 && (
                    <span className="text-red-600">
                      支: {formatCurrency(summary.expense)}
                    </span>
                  )}
                </div>
              </div>

              {/* 该日期的交易列表 */}
              <div className="space-y-3">
                {group.transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={() => handleDeleteClick(transaction)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 删除确认弹窗 */}
      <DeleteTransaction
        transaction={deleteTarget}
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: () => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const categoryIcon = getCategoryIcon(transaction.category);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        {/* 左侧：图标、分类、日期、备注 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">{categoryIcon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {transaction.category}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {transaction.type === 'income' ? '收入' : '支出'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1 truncate">
                {formatDisplayDate(transaction.date)}
                {transaction.note && ` · ${transaction.note}`}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：金额和删除按钮 */}
        <div className="flex items-center gap-3 ml-4">
          <span
            className={`text-lg font-semibold ${
              transaction.type === 'income'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>
          <button
            onClick={onDelete}
            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="删除"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
