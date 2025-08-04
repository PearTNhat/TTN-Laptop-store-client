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
  const [pendingOrders, setPendingOrders] = useState([]);

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
