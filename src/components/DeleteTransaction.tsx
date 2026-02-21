import { useEffect } from 'react';
import { Transaction } from '../types';
import { formatDisplayDate, formatCurrency } from '../utils/date';
import { getCategoryIcon } from '../types';

interface DeleteTransactionProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteTransaction = ({
  transaction,
  isOpen,
  onConfirm,
  onCancel,
}: DeleteTransactionProps) => {
  // ESC 键关闭弹窗
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !transaction) {
    return null;
  }

  const categoryIcon = getCategoryIcon(transaction.category);
  const typeLabel = transaction.type === 'income' ? '收入' : '支出';
  const amountColor = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onCancel}
      />

      {/* 弹窗 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
          {/* 头部 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
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
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">确认删除</h2>
                <p className="text-sm text-gray-500">此操作无法撤销</p>
              </div>
            </div>
          </div>

          {/* 记录详情 */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{categoryIcon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{transaction.category}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {typeLabel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {formatDisplayDate(transaction.date)}
                    {transaction.note && ` · ${transaction.note}`}
                  </p>
                </div>
              </div>
              <span className={`text-lg font-semibold ${amountColor}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="p-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </>
  );
};
