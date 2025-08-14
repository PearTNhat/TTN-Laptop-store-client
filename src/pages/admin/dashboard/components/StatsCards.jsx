import React, { useEffect, useState, useCallback } from "react";
import {
  HiTrendingUp,
  HiTrendingDown,
  HiUsers,
  HiShoppingCart,
  HiCurrencyDollar,
} from "react-icons/hi";
import { FaChartLine } from "react-icons/fa";
import { useSelector } from "react-redux";
import { apiGetSummary } from "~/apis/dashboardApi";
import { showToastError } from "~/utils/alert";

const StatsCards = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [statsData, setStatsData] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStatusCard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGetSummary({ accessToken });
      if (response.code === 200) {
        setStatsData(response.data);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchStatusCard();
    }
  }, [accessToken, fetchStatusCard]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const statsCards = [
    {
      id: "customers",
      title: "Tổng khách hàng",
      value: formatNumber(statsData.totalCustomers),
      rawValue: statsData.totalCustomers,
      icon: <HiUsers />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white",
      borderColor: "border-blue-200",
      shadowColor: "shadow-blue-100",
    },
    {
      id: "orders",
      title: "Tổng đơn hàng",
      value: formatNumber(statsData.totalOrders),
      rawValue: statsData.totalOrders,
      icon: <HiShoppingCart />,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-white",
      borderColor: "border-green-200",
      shadowColor: "shadow-green-100",
    },
    {
      id: "revenue",
      title: "Tổng doanh thu",
      value: formatCurrency(statsData.totalRevenue),
      rawValue: statsData.totalRevenue,
      icon: <HiCurrencyDollar />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white",
      borderColor: "border-purple-200",
      shadowColor: "shadow-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  console.log(statsData);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {statsCards.map((card) => (
        <div
          key={card.id}
          className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border ${card.borderColor} p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Content */}
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <FaChartLine className="w-4 h-4 text-gray-500 mr-2" />
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {card.title}
                </p>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-4 group-hover:scale-105 transition-transform duration-300">
                {card.value}
              </p>

              {/* Status indicator */}
              <div className="flex items-center">
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">
                    Hoạt động
                  </span>
                </div>
              </div>
            </div>

            {/* Icon with enhanced styling */}
            <div className="relative">
              <div
                className={`${card.bgColor} p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${card.shadowColor} shadow-lg`}
              >
                <div className={`${card.textColor} text-2xl`}>{card.icon}</div>
              </div>

              {/* Floating indicator for non-zero values */}
              {card.rawValue > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <HiTrendingUp className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Animated bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent">
            <div
              className={`h-full bg-gradient-to-r ${card.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center`}
            ></div>
          </div>

          {/* Decorative corner element */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <div
              className={`w-full h-full ${card.bgColor} rounded-full transform translate-x-10 -translate-y-10`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
