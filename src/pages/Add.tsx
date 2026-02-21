import { useNavigate, Link } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { AddTransaction } from '../components/AddTransaction';

export const Add = () => {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

  const handleSubmit = (data: {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    note: string;
    date: string;
  }) => {
    addTransaction({
      id: Date.now().toString(),
      ...data,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">添加记录</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AddTransaction onSubmit={handleSubmit} />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-lg mx-auto flex">
          <Link to="/" className="flex-1 py-3 text-center text-gray-500">
            记录
          </Link>
          <Link
            to="/add"
            className="flex-1 py-3 text-center text-blue-600 font-medium"
          >
            添加
          </Link>
          <Link
            to="/statistics"
            className="flex-1 py-3 text-center text-gray-500"
          >
            统计
          </Link>
        </div>
      </nav>
    </div>
  );
};
