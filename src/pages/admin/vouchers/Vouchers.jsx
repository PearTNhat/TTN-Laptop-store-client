import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPercent,
  FaCalendarAlt,
  FaGift,
} from "react-icons/fa";

function Vouchers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const vouchersPerPage = 10;

  const vouchers = [
    {
      id: 1,
      code: "WELCOME10",
      name: "Chào mừng khách hàng mới",
      description: "Giảm 10% cho đơn hàng đầu tiên",
      discountType: "Phần trăm",
      discountValue: 10,
      minOrderValue: 5000000,
      maxDiscount: 1000000,
      usageLimit: 100,
      usedCount: 45,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Hoạt động",
      createdDate: "2024-01-01",
    },
    {
      id: 2,
      code: "LAPTOP500K",
      name: "Giảm giá laptop",
      description: "Giảm 500.000đ cho đơn hàng laptop",
      discountType: "Số tiền",
      discountValue: 500000,
      minOrderValue: 10000000,
      maxDiscount: 500000,
      usageLimit: 50,
      usedCount: 12,
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      status: "Hoạt động",
      createdDate: "2024-01-15",
    },
    {
      id: 3,
      code: "SUMMER2024",
      name: "Khuyến mãi hè 2024",
      description: "Giảm 15% tối đa 2 triệu",
      discountType: "Phần trăm",
      discountValue: 15,
      minOrderValue: 15000000,
      maxDiscount: 2000000,
      usageLimit: 200,
      usedCount: 167,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "Hết hạn",
      createdDate: "2024-05-20",
    },
    {
      id: 4,
      code: "STUDENT20",
      name: "Ưu đãi sinh viên",
      description: "Giảm 20% cho sinh viên",
      discountType: "Phần trăm",
      discountValue: 20,
      minOrderValue: 8000000,
      maxDiscount: 1500000,
      usageLimit: 300,
      usedCount: 89,
      startDate: "2024-09-01",
      endDate: "2024-12-31",
      status: "Tạm dừng",
      createdDate: "2024-08-25",
    },
    {
      id: 5,
      code: "FREESHIP",
      name: "Miễn phí vận chuyển",
      description: "Miễn phí ship cho đơn từ 3 triệu",
      discountType: "Miễn phí ship",
      discountValue: 0,
      minOrderValue: 3000000,
      maxDiscount: 100000,
      usageLimit: 1000,
      usedCount: 234,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Hoạt động",
      createdDate: "2024-01-01",
    },
  ];

  const statuses = ["Hoạt động", "Tạm dừng", "Hết hạn", "Chưa bắt đầu"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoạt động":
        return "bg-green-100 text-green-800";
      case "Tạm dừng":
        return "bg-yellow-100 text-yellow-800";
      case "Hết hạn":
        return "bg-red-100 text-red-800";
      case "Chưa bắt đầu":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDiscountTypeColor = (type) => {
    switch (type) {
      case "Phần trăm":
        return "bg-blue-100 text-blue-800";
      case "Số tiền":
        return "bg-green-100 text-green-800";
      case "Miễn phí ship":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDiscount = (voucher) => {
    if (voucher.discountType === "Phần trăm") {
      return `${voucher.discountValue}%`;
    } else if (voucher.discountType === "Số tiền") {
      return formatPrice(voucher.discountValue);
    } else {
      return "Miễn phí ship";
    }
  };

  const getUsagePercentage = (used, limit) => {
    return Math.round((used / limit) * 100);
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || voucher.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = filteredVouchers.slice(
    indexOfFirstVoucher,
    indexOfLastVoucher
  );

  const activeVouchers = vouchers.filter(
    (v) => v.status === "Hoạt động"
  ).length;
  const totalUsage = vouchers.reduce(
    (sum, voucher) => sum + voucher.usedCount,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý khuyến mãi
        </h1>
        <p className="text-gray-600">
          Quản lý các mã giảm giá và chương trình khuyến mãi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Tổng voucher</p>
              <p className="text-2xl font-bold text-gray-900">
                {vouchers.length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaGift className="text-xl text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activeVouchers}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <FaGift className="text-xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Đã sử dụng</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <FaGift className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Hết hạn</p>
              <p className="text-2xl font-bold text-gray-900">
                {vouchers.filter((v) => v.status === "Hết hạn").length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <FaGift className="text-xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm voucher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FaPlus />
              Tạo voucher
            </button>
          </div>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {currentVouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {voucher.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        voucher.status
                      )}`}
                    >
                      {voucher.status}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 inline-block mb-2">
                    <span className="font-mono text-lg font-bold text-gray-800">
                      {voucher.code}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{voucher.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Loại giảm giá</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDiscountTypeColor(
                      voucher.discountType
                    )}`}
                  >
                    {voucher.discountType}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Giá trị</p>
                  <p className="font-semibold text-blue-600">
                    {formatDiscount(voucher)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Đơn tối thiểu</p>
                  <p className="font-semibold">
                    {formatPrice(voucher.minOrderValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Giảm tối đa</p>
                  <p className="font-semibold">
                    {formatPrice(voucher.maxDiscount)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Sử dụng: {voucher.usedCount}/{voucher.usageLimit}
                  </span>
                  <span className="text-gray-600">
                    {getUsagePercentage(voucher.usedCount, voucher.usageLimit)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${getUsagePercentage(
                        voucher.usedCount,
                        voucher.usageLimit
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt />
                  <span>
                    {voucher.startDate} - {voucher.endDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  <FaEdit />
                  Chỉnh sửa
                </button>
                <button className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">{indexOfFirstVoucher + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(indexOfLastVoucher, filteredVouchers.length)}
              </span>{" "}
              trong{" "}
              <span className="font-medium">{filteredVouchers.length}</span> kết
              quả
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Trước
              </button>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(filteredVouchers.length / vouchersPerPage),
                      currentPage + 1
                    )
                  )
                }
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vouchers;
