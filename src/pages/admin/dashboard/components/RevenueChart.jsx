import React, { useEffect, useState, useCallback } from "react";
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
import { FaChartBar, FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { apiRevenue } from "~/apis/dashboardApi";
import { showToastError } from "~/utils/alert";

const RevenueChart = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [revenueData, setRevenueData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Mặc định là năm hiện tại

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Convert API data to chart format
  const formatRevenueDataForChart = (data) => {
    return data.map((item) => {
      const month = item.yearMonth.split("-")[1];
      // Chia các giá trị cho 1000 để ra số liệu thực
      const realGrossProfit = item.monthlyGrossProfit / 1000;

      return {
        month: `T${parseInt(month)}`,
        monthlyRevenue: item.monthlyRevenue / 1000,
        monthlyGrossProfit: realGrossProfit,
        monthlyTotalCost: item.monthlyTotalCost / 1000,
        profit: realGrossProfit, // Cập nhật cả giá trị này
      };
    });
  };

  // Get available years (current year and previous years)
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const fetchRevenueByYear = useCallback(
    async (year) => {
      try {
        const response = await apiRevenue({ accessToken, year });
        if (response.code === 200) {
          setRevenueData(formatRevenueDataForChart(response.data));
        } else {
          throw new Error(response.message || "Failed to fetch data");
        }
      } catch (error) {
        showToastError(error.message);
      }
    },
    [accessToken] // Không cần formatRevenueDataForChart ở đây vì nó là hàm thuần túy
  );

  useEffect(() => {
    if (accessToken) {
      fetchRevenueByYear(selectedYear);
    }
  }, [accessToken, selectedYear, fetchRevenueByYear]);

  // Đã bỏ console.log ở đây
  console.log(revenueData);
  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      {/* Year Selector */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            Chọn năm xem báo cáo
          </h3>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {getAvailableYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaChartBar className="mr-3 text-green-600" />
            Báo cáo doanh thu năm {selectedYear}
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Doanh thu</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Lợi nhuận gộp</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Tổng chi phí</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6} />
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
                    case "monthlyRevenue":
                      label = "Doanh thu";
                      break;
                    case "monthlyGrossProfit":
                      label = "Lợi nhuận";
                      break;
                    case "monthlyTotalCost":
                      label = "Tổng chi phí";
                      break;
                    default:
                      label = name;
                  }
                  return [formatCurrency(value), label];
                }}
              />
              <Bar
                dataKey="monthlyRevenue"
                fill="url(#colorRevenue)"
                radius={[4, 4, 0, 0]}
                name="monthlyRevenue"
              />
              <Bar
                dataKey="monthlyGrossProfit"
                fill="url(#colorProfit)"
                radius={[4, 4, 0, 0]}
                name="monthlyGrossProfit"
              />
              <Bar
                dataKey="monthlyTotalCost"
                fill="url(#colorCost)"
                radius={[4, 4, 0, 0]}
                name="monthlyTotalCost"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                revenueData.reduce((sum, item) => sum + item.monthlyRevenue, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng doanh thu</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                revenueData.reduce(
                  (sum, item) => sum + item.monthlyGrossProfit,
                  0
                )
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng lợi nhuận gộp</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(
                revenueData.reduce(
                  (sum, item) => sum + item.monthlyTotalCost,
                  0
                )
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng chi phí</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
