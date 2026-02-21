import { useState } from 'react';
import { TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES, Category } from '../types';
import { formatDate } from '../utils/date';

interface AddTransactionProps {
  onSubmit: (data: {
    amount: number;
    type: TransactionType;
    category: string;
    note: string;
    date: string;
  }) => void;
  onCancel?: () => void;
}

interface FormData {
  type: TransactionType;
  amount: string;
  category: string;
  note: string;
  date: string;
}

type FormFieldName = 'amount' | 'category' | 'date' | 'note' | 'type';

interface FormErrors {
  amount?: string;
  category?: string;
  date?: string;
  note?: string;
  type?: string;
}

interface TouchedFields {
  amount?: boolean;
  category?: boolean;
  date?: boolean;
  note?: boolean;
  type?: boolean;
}

export const AddTransaction = ({ onSubmit, onCancel }: AddTransactionProps) => {
  const [formData, setFormData] = useState<FormData>({
    type: 'expense',
    amount: '',
    category: '',
    note: '',
    date: formatDate(new Date()),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validateField = (name: FormFieldName, value: string): string | null => {
    switch (name) {
      case 'amount':
        if (!value) return '请输入金额';
        if (parseFloat(value) <= 0) return '金额必须大于0';
        if (parseFloat(value) > 999999.99) return '金额超出限制';
        return null;
      case 'category':
        if (!value) return '请选择分类';
        return null;
      case 'date':
        if (!value) return '请选择日期';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (name: FormFieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 清除类型切换时的分类
    if (name === 'type') {
      setFormData((prev) => ({ ...prev, type: value as TransactionType, category: '' }));
      setErrors((prev) => ({ ...prev, category: undefined }));
      return;
    }

    // 实时验证已触达的字段
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error ?? undefined }));
    }
  };

  const handleBlur = (name: FormFieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error ?? undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证所有字段
    const newErrors: FormErrors = {};
    const fieldsToValidate: FormFieldName[] = ['amount', 'category', 'date'];
    fieldsToValidate.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        amount: true,
        category: true,
        date: true,
      });
      return;
    }

    onSubmit({
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      note: formData.note,
      date: formData.date,
    });
  };

  const handleCategoryClick = (categoryName: string) => {
    handleChange('category', categoryName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 收支类型选择 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          类型
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleChange('type', 'expense')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              formData.type === 'expense'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            支出
          </button>
          <button
            type="button"
            onClick={() => handleChange('type', 'income')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              formData.type === 'income'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            收入
          </button>
        </div>
      </div>

      {/* 金额输入 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          金额 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            ¥
          </span>
          <input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            onBlur={() => handleBlur('amount')}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
              errors.amount
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
            autoFocus
          />
        </div>
        {errors.amount && touched.amount && (
          <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      {/* 分类选择 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          分类 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat: Category) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                formData.category === cat.name
                  ? 'bg-blue-100 border-2 border-blue-500 scale-105'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs mt-1">{cat.name}</span>
            </button>
          ))}
        </div>
        {errors.category && touched.category && (
          <p className="mt-2 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      {/* 日期选择 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          日期 <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          onBlur={() => handleBlur('date')}
          max={formatDate(new Date())}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
            errors.date
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />
        {errors.date && touched.date && (
          <p className="mt-2 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* 备注输入 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
          备注 <span className="text-gray-400">（可选）</span>
        </label>
        <input
          id="note"
          type="text"
          value={formData.note}
          onChange={(e) => handleChange('note', e.target.value)}
          placeholder="添加备注信息..."
          maxLength={50}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:ring-blue-200 focus:outline-none transition-colors"
        />
        <p className="mt-1 text-xs text-gray-400 text-right">
          {formData.note.length}/50
        </p>
      </div>

      {/* 按钮组 */}
      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          className="flex-1 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          保存
        </button>
      </div>
    </form>
  );
};
