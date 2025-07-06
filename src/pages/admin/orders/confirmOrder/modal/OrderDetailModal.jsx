import React from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaShoppingCart,
  FaMoneyBillAlt,
} from "react-icons/fa";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <FaShoppingCart className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Chi tiết đơn hàng
              </h2>
              <p className="text-gray-600">{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Order Status & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  <span className="font-medium">{order.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <span>{order.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{order.address}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" />
                Thông tin đơn hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium">{order.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thanh toán:</span>
                  <div className="flex items-center gap-2">
                    <FaCreditCard className="text-blue-500" />
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(order.total)}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaShoppingCart className="text-purple-500" />
              Sản phẩm ({order.items?.length || 0} sản phẩm)
            </h3>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Đơn giá: {formatPrice(item.price)}đ
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex-shrink-0">
                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-gray-700">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.total)}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total Summary */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaMoneyBillAlt className="text-green-500" />
                    Tổng cộng:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(order.total)}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
