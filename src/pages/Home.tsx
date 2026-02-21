import { Link } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { ListTransaction } from '../components/ListTransaction';

export const Home = () => {
  const { transactions, deleteTransaction } = useTransactions();

  // 按日期倒序排列
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">记账本</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <ListTransaction
          transactions={sortedTransactions}
          onDelete={deleteTransaction}
        />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-lg mx-auto flex">
          <Link
            to="/"
            className="flex-1 py-3 text-center text-blue-600 font-medium"
          >
            记录
          </Link>
          <Link
            to="/add"
            className="flex-1 py-3 text-center text-gray-500"
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
