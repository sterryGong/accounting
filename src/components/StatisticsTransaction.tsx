import { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/date';
import { useStatistics, useCategoryStatistics, PeriodType, CategoryStatistics } from '../hooks/useStatistics';
import { getCategoryIcon } from '../types';

interface StatisticsTransactionProps {
  transactions: Transaction[];
}

type ChartType = 'expense' | 'income';

// 饼状图组件
interface PieChartProps {
  data: CategoryStatistics[];
  total: number;
  size?: number;
}

const PieChart = ({ data, total, size = 200 }: PieChartProps) => {
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm text-gray-400">暂无数据</p>
        </div>
      </div>
    );
  }

  // 计算每个扇形的路径
  let currentAngle = -90; // 从顶部开始
  const radius = size / 2;
  const center = radius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {data.map((item) => {
          if (item.percentage === 0) return null;

          const angle = (item.percentage / 100) * 360;
          const pathD = describeArc(center, center, radius - 40, currentAngle, currentAngle + angle);

          currentAngle += angle;

          return (
            <g key={item.category}>
              <path
                d={pathD}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{item.category}: {item.percentage.toFixed(1)}%</title>
              </path>
            </g>
          );
        })}
        {/* 中心的白色圆圈，形成环形图效果 */}
        <circle
          cx={center}
          cy={center}
          r={radius - 55}
          fill="white"
        />
      </svg>
      {/* 中心显示总金额 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xs text-gray-500">总计</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
};

// 计算扇形路径的辅助函数
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
}

// 分类统计列表
interface CategoryListProps {
  data: CategoryStatistics[];
  type: 'income' | 'expense';
}

const CategoryList = ({ data, type }: CategoryListProps) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>暂无{type === 'income' ? '收入' : '支出'}记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.category} className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(item.category)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900">{item.category}</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatisticsTransaction = ({ transactions }: StatisticsTransactionProps) => {
  const [period, setPeriod] = useState<PeriodType>('month');
  const [chartType, setChartType] = useState<ChartType>('expense');

  const stats = useStatistics(transactions, period);
  const expenseStats = useCategoryStatistics(transactions, period, 'expense');
  const incomeStats = useCategoryStatistics(transactions, period, 'income');

  const currentChartStats = chartType === 'expense' ? expenseStats : incomeStats;

  return (
    <div className="space-y-6">
      {/* 时间段切换 */}
      <div className="bg-white rounded-lg shadow-sm p-2 flex">
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            period === 'month'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          月度
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            period === 'year'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          年度
        </button>
      </div>

      {/* 收支汇总卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-sm text-gray-500 mb-4">
          {period === 'month' ? '本月' : '本年'}收支
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-600">收入</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(stats.income)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-gray-600">支出</span>
            </div>
            <span className="text-lg font-semibold text-red-600">
              {formatCurrency(stats.expense)}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="font-medium">结余</span>
            <span
              className={`text-xl font-bold ${
                stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(stats.balance)}
            </span>
          </div>
        </div>
      </div>

      {/* 饼状图统计 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm text-gray-500">分类统计</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('expense')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                chartType === 'expense'
                  ? 'bg-red-100 text-red-700 font-medium'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              支出
            </button>
            <button
              onClick={() => setChartType('income')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                chartType === 'income'
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              收入
            </button>
          </div>
        </div>

        {/* 饼状图和图例 */}
        <div className="flex flex-col items-center mb-6">
          <PieChart data={currentChartStats.categories} total={currentChartStats.total} />
        </div>

        {/* 分类列表 */}
        <CategoryList
          data={currentChartStats.categories}
          type={chartType}
        />
      </div>
    </div>
  );
};
