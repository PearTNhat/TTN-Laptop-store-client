import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FaChartArea, FaChartBar } from "react-icons/fa";

const RevenueChart = () => {
  // Dữ liệu so sánh tiền mua và tiền bán
  const buyVsSellData = [
    { month: "T1", buy: 800, sell: 1200, profit: 400 },
    { month: "T2", buy: 1200, sell: 1800, profit: 600 },
    { month: "T3", buy: 1500, sell: 2200, profit: 700 },
    { month: "T4", buy: 1300, sell: 1900, profit: 600 },
    { month: "T5", buy: 1600, sell: 2400, profit: 800 },
    { month: "T6", buy: 1900, sell: 2800, profit: 900 },
    { month: "T7", buy: 1750, sell: 2600, profit: 850 },
    { month: "T8", buy: 2100, sell: 3200, profit: 1100 },
    { month: "T9", buy: 1950, sell: 2900, profit: 950 },
    { month: "T10", buy: 2400, sell: 3600, profit: 1200 },
    { month: "T11", buy: 2500, sell: 3800, profit: 1300 },
    { month: "T12", buy: 2800, sell: 4200, profit: 1400 },
  ];

  // Dữ liệu so sánh thương hiệu
  const brandData = [
    { brand: "Apple", revenue: 1200, growth: 15 },
    { brand: "Dell", revenue: 980, growth: 12 },
    { brand: "Asus", revenue: 850, growth: 18 },
    { brand: "HP", revenue: 720, growth: 8 },
    { brand: "Lenovo", revenue: 640, growth: 22 },
  ];

  const formatCurrency = (value) => {
    return `${value}M VNĐ`;
  };

  return (
    <div className="grid grid-cols-1  gap-6 mb-8">
      {/* Biểu đồ doanh thu theo tháng */}

      {/* Biểu đồ so sánh tiền mua và tiền bán */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaChartBar className="mr-3 text-green-600" />
            So sánh tiền mua vs tiền bán
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Tiền mua</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Tiền bán</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Lợi nhuận</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buyVsSellData}>
              <defs>
                <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => {
                  let label = "";
                  switch (name) {
                    case "buy":
                      label = "Tiền mua";
                      break;
                    case "sell":
                      label = "Tiền bán";
                      break;
                    case "profit":
                      label = "Lợi nhuận";
                      break;
                    default:
                      label = name;
                  }
                  return [formatCurrency(value), label];
                }}
              />
              <Bar
                dataKey="buy"
                fill="url(#colorBuy)"
                radius={[4, 4, 0, 0]}
                name="buy"
              />
              <Bar
                dataKey="sell"
                fill="url(#colorSell)"
                radius={[4, 4, 0, 0]}
                name="sell"
              />
              <Bar
                dataKey="profit"
                fill="url(#colorProfit)"
                radius={[4, 4, 0, 0]}
                name="profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(
                buyVsSellData.reduce((sum, item) => sum + item.buy, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng tiền mua</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                buyVsSellData.reduce((sum, item) => sum + item.sell, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng tiền bán</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                buyVsSellData.reduce((sum, item) => sum + item.profit, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng lợi nhuận</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ so sánh thương hiệu */}
      {/* <div className="xl:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaChartBar className="mr-3 text-green-600" />
            So sánh doanh thu theo thương hiệu
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={brandData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="brand" stroke="#6B7280" fontSize={12} />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => [
                  name === "revenue" ? formatCurrency(value) : `+${value}%`,
                  name === "revenue" ? "Doanh thu" : "Tăng trưởng",
                ]}
              />
              <Bar
                dataKey="revenue"
                fill="url(#colorBar)"
                radius={[8, 8, 0, 0]}
                strokeWidth={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}
    </div>
  );
};

export default RevenueChart;
