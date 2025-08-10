import React from "react";
import {
  StatsCards,
  RecentOrders,
  TopProducts,
  RevenueChart,
} from "./components";

function DashBoard() {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header with gradient */}
      <div className="mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 rounded-2xl"></div>
        <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Chào mừng bạn đến với trang quản trị
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Revenue Charts */}
      <RevenueChart />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>

        {/* Top Products */}
        <TopProducts />
      </div>
    </div>
  );
}

export default DashBoard;
