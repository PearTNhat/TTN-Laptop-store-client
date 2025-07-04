import React from "react";
import {
  FaUsers,
  FaShoppingCart,
  FaLaptop,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  StatsCards,
  RecentOrders,
  TopProducts,
  RevenueChart,
  QuickActions,
} from "./components";

function DashBoard() {
  const statsCards = [
    {
      title: "Tổng người dùng",
      value: "2,459",
      change: "+12.5%",
      trend: "up",
      icon: <FaUsers />,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Tổng đơn hàng",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      icon: <FaShoppingCart />,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Sản phẩm",
      value: "567",
      change: "+4.1%",
      trend: "up",
      icon: <FaLaptop />,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Doanh thu",
      value: "2.4B VNĐ",
      change: "-2.3%",
      trend: "down",
      icon: <FaMoneyBillWave />,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "Nguyễn Văn A",
      product: "MacBook Pro M3",
      amount: "45,000,000 VNĐ",
      status: "Hoàn thành",
      date: "2024-01-15",
    },
    {
      id: "#12346",
      customer: "Trần Thị B",
      product: "Dell XPS 13",
      amount: "32,000,000 VNĐ",
      status: "Đang xử lý",
      date: "2024-01-15",
    },
    {
      id: "#12347",
      customer: "Lê Văn C",
      product: "Asus ROG Strix",
      amount: "28,000,000 VNĐ",
      status: "Đã giao",
      date: "2024-01-14",
    },
    {
      id: "#12348",
      customer: "Phạm Thị D",
      product: "HP Pavilion",
      amount: "18,000,000 VNĐ",
      status: "Hủy",
      date: "2024-01-14",
    },
    {
      id: "#12349",
      customer: "Hoàng Văn E",
      product: "Lenovo ThinkPad",
      amount: "25,000,000 VNĐ",
      status: "Hoàn thành",
      date: "2024-01-13",
    },
  ];

  const topProducts = [
    { name: "MacBook Pro M3", sales: 145, revenue: "6.5B VNĐ", growth: "+23%" },
    { name: "Dell XPS 13", sales: 98, revenue: "3.1B VNĐ", growth: "+18%" },
    { name: "Asus ROG Strix", sales: 76, revenue: "2.1B VNĐ", growth: "+15%" },
    { name: "HP Pavilion", sales: 54, revenue: "972M VNĐ", growth: "+8%" },
    {
      name: "Lenovo ThinkPad",
      sales: 43,
      revenue: "1.075B VNĐ",
      growth: "+12%",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Đã giao":
        return "bg-blue-100 text-blue-800";
      case "Hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      <StatsCards statsCards={statsCards} />

      {/* Revenue Charts */}
      <RevenueChart />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <RecentOrders
            recentOrders={recentOrders}
            getStatusColor={getStatusColor}
          />
        </div>

        {/* Top Products */}
        <TopProducts topProducts={topProducts} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

export default DashBoard;
