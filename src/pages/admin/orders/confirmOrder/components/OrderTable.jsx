import React from "react";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaCreditCard,
} from "react-icons/fa";

const OrderTable = ({
  orders,
  onViewDetail,
  onConfirm,
  onReject,
  showConfirmActions = false,
}) => {
  const getStatusColor = (status) => {
    const statusColors = {
      "Chờ xác nhận": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Đang xử lý": "bg-blue-100 text-blue-800 border-blue-200",
      "Đang giao": "bg-purple-100 text-purple-800 border-purple-200",
      "Hoàn thành": "bg-green-100 text-green-800 border-green-200",
      "Đã hủy": "bg-red-100 text-red-800 border-red-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentMethodColor = (method) => {
    return method === "Tiền mặt"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaShoppingCart className="text-blue-500" />
                  Đơn hàng
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaUser className="text-purple-500" />
                  Khách hàng
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-orange-500" />
                  Ngày đặt
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaMoneyBillAlt className="text-green-500" />
                  Tổng tiền
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaCreditCard className="text-indigo-500" />
                  Thanh toán
                </div>
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {order.id}
                    </div>
                    <div
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.customer}
                    </div>
                    <div className="text-gray-500 text-xs">{order.email}</div>
                    <div className="text-gray-500 text-xs">{order.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {order.orderDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">
                    {formatPrice(order.total)}đ
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPaymentMethodColor(
                      order.paymentMethod
                    )}`}
                  >
                    {order.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* View Detail Button */}
                    <button
                      onClick={() => onViewDetail(order)}
                      className="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:from-blue-600 hover:to-cyan-600"
                      title="Xem chi tiết"
                    >
                      <FaEye className="text-sm" />
                    </button>

                    {/* Confirm/Reject Actions */}
                    {showConfirmActions && order.status === "Chờ xác nhận" && (
                      <>
                        <button
                          onClick={() => onConfirm(order)}
                          className="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:from-green-600 hover:to-emerald-600"
                          title="Xác nhận đơn hàng"
                        >
                          <FaCheck className="text-sm" />
                        </button>

                        <button
                          onClick={() => onReject(order)}
                          className="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:from-red-600 hover:to-rose-600"
                          title="Từ chối đơn hàng"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
