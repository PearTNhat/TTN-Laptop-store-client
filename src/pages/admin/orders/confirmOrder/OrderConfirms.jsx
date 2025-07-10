import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaClock,
  FaEye,
  FaShoppingCart,
} from "react-icons/fa";
import OrderActions from "./components/OrderActions";
import OrderTable from "./components/OrderTable";
import OrderDetailModal from "./modal/OrderDetailModal";
import ConfirmModal from "../../../../components/modal/ConfirmModal";

function OrderConfirms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data cho đơn hàng chờ xác nhận
  const [pendingOrders, setPendingOrders] = useState([
    {
      id: "#ORD006",
      customer: "Nguyễn Thị F",
      email: "nguyenthif@email.com",
      phone: "0901234572",
      orderDate: "2024-01-16",
      total: 52000000,
      paymentMethod: "Chuyển khoản",
      status: "Chờ xác nhận",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      items: [
        {
          id: 1,
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
          name: 'MacBook Pro 14" M3 Pro',
          price: 45000000,
          quantity: 1,
          total: 45000000,
        },
        {
          id: 2,
          image:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
          name: "Apple Magic Mouse",
          price: 3500000,
          quantity: 2,
          total: 7000000,
        },
      ],
    },
    {
      id: "#ORD007",
      customer: "Trần Văn G",
      email: "tranvang@email.com",
      phone: "0901234573",
      orderDate: "2024-01-16",
      total: 28000000,
      paymentMethod: "Tiền mặt",
      status: "Chờ xác nhận",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      items: [
        {
          id: 3,
          image:
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
          name: "Asus ROG Strix G15",
          price: 28000000,
          quantity: 1,
          total: 28000000,
        },
      ],
    },
  ]);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleConfirmOrder = async (order) => {
    const result = await ConfirmModal.approve({
      title: "Xác nhận đơn hàng",
      text: `Bạn có chắc chắn muốn xác nhận đơn hàng ${order.id}?`,
      confirmButtonText: "Xác nhận",
    });

    if (result.isConfirmed) {
      setPendingOrders((orders) =>
        orders.map((o) =>
          o.id === order.id ? { ...o, status: "Đang xử lý" } : o
        )
      );

      ConfirmModal.toast({
        icon: "success",
        title: "Đã xác nhận đơn hàng thành công!",
      });
    }
  };

  const handleRejectOrder = async (order) => {
    const result = await ConfirmModal.withInput({
      title: "Từ chối đơn hàng",
      text: `Từ chối đơn hàng ${order.id}`,
      inputPlaceholder: "Nhập lý do từ chối...",
      confirmButtonText: "Từ chối",
      confirmButtonColor: "#dc3545",
    });

    if (result.isConfirmed) {
      setPendingOrders((orders) =>
        orders.map((o) =>
          o.id === order.id
            ? { ...o, status: "Đã hủy", rejectReason: result.value }
            : o
        )
      );

      ConfirmModal.toast({
        icon: "success",
        title: "Đã từ chối đơn hàng thành công!",
      });
    }
  };

  const filteredOrders = pendingOrders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customer.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
            <FaClock className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Xác nhận đơn hàng
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các đơn hàng chờ xác nhận
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>{filteredOrders.length} đơn chờ xác nhận</span>
          </div>
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-gray-400" />
            <span>
              Tổng giá trị:{" "}
              {filteredOrders
                .reduce((sum, order) => sum + order.total, 0)
                .toLocaleString("vi-VN")}
              đ
            </span>
          </div>
        </div>
      </div>

      {/* Search Actions */}
      <OrderActions
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        showAddButton={false}
      />

      {/* Orders Table */}
      <div className="shadow-md rounded-xl">
        <OrderTable
          orders={filteredOrders}
          onViewDetail={handleViewDetail}
          onConfirm={handleConfirmOrder}
          onReject={handleRejectOrder}
          showConfirmActions={true}
        />
      </div>

      {/* Modals */}
      {isDetailModalOpen && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
}

export default OrderConfirms;
