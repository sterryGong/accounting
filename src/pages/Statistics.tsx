import { Link } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { StatisticsTransaction } from '../components/StatisticsTransaction';

export const Statistics = () => {
  const { transactions } = useTransactions();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">统计分析</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <StatisticsTransaction transactions={transactions} />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-lg mx-auto flex">
          <Link to="/" className="flex-1 py-3 text-center text-gray-500">
            记录
          </Link>
          <Link to="/add" className="flex-1 py-3 text-center text-gray-500">
            添加
          </Link>
          <Link
            to="/statistics"
            className="flex-1 py-3 text-center text-blue-600 font-medium"
          >
            统计
          </Link>
        </div>
      </nav>
    </div>
  );
};
