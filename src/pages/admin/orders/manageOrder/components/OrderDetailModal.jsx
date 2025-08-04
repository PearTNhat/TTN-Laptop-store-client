import React from "react";
import {
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
} from "react-icons/fa";
import { formatPrice } from "~/utils/helper";
import { getPaymentMethodStyle } from "../../utils/orderHelper";

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Chờ xác nhận",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "PROCESSING":
        return {
          text: "Đang xử lý",
          className: "bg-blue-100 text-blue-800 border-blue-300",
        };
      case "DELIVERED":
        return {
          text: "Đã giao hàng",
          className: "bg-green-100 text-green-800 border-green-300",
        };
      case "CANCELED":
        return {
          text: "Đã hủy",
          className: "bg-red-100 text-red-800 border-red-300",
        };
      default:
        return {
          text: status,
          className: "bg-gray-100 text-gray-800 border-gray-300",
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const paymentStyle = getPaymentMethodStyle(order.paymentMethod);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
              <p className="text-blue-100">Mã đơn hàng: {order.code}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Người nhận:</span>{" "}
                    {order.recipient}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <span>{order.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaShoppingCart className="text-green-600" />
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Ngày tạo:</span>{" "}
                    {formatDate(order.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span>
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCreditCard className="text-gray-400" />
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStyle.className}`}
                    >
                      <span>{paymentStyle.icon}</span>
                      {paymentStyle.text}
                    </span>
                  </div>
                  {order.note && (
                    <div>
                      <span className="font-medium">Ghi chú:</span> {order.note}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                Sản phẩm đặt hàng ({order.orderDetails?.length || 0} sản phẩm)
              </h3>
              <div className="space-y-4">
                {order.orderDetails?.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.thumbnail || "/images/default-product.png"}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.src = "/images/default-product.png";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          {item.title}
                        </h4>

                        {/* Specifications */}
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          {item.ramValue && (
                            <div>
                              <span className="font-medium text-gray-600">
                                RAM:
                              </span>
                              <span className="ml-1 text-gray-800">
                                {item.ramValue}
                              </span>
                            </div>
                          )}
                          {item.hardDriveValue && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Ổ cứng:
                              </span>
                              <span className="ml-1 text-gray-800">
                                {item.hardDriveValue}
                              </span>
                            </div>
                          )}
                          {item.colorName && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Màu sắc:
                              </span>
                              <span className="ml-1 text-gray-800">
                                {item.colorName}
                              </span>
                            </div>
                          )}
                          {item.serialNumber && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Serial:
                              </span>
                              <span className="ml-1 text-gray-800 font-mono">
                                {item.serialNumber}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Số lượng:{" "}
                              </span>
                              <span className="text-blue-600 font-semibold">
                                {item.quantity}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Đơn giá:{" "}
                              </span>
                              <span className="text-green-600 font-semibold">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                            {item.originalPrice > item.price && (
                              <div>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tổng số lượng:</span>
                    <span className="font-medium">
                      {order.totalQuantity} sản phẩm
                    </span>
                  </div>
                  {order.shopDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá shop:</span>
                      <span>-{formatPrice(order.shopDiscount)}</span>
                    </div>
                  )}
                  {order.userDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá người dùng:</span>
                      <span>-{formatPrice(order.userDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
