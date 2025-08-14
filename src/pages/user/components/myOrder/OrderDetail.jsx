import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiInfo,
  FiTruck,
  FiX,
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import RatingBox from "../RatingBox";
import { formatPrice, formatDate } from "~/utils/helper";

const OrderDetails = ({ isOpen, onClose, order }) => {
  const [selectedOrder, setSelectedOrder] = useState(order);
  useEffect(() => {
    if (order) {
      setSelectedOrder(order);
    }
  }, [order]);

  if (!order) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-100 to-blue-100 shadow-sm">
            <Dialog.Title className="text-2xl font-semibold text-gray-800 flex items-center">
              <span className="bg-indigo-500 text-white p-3 rounded-xl mr-3 shadow-md">
                <FiShoppingCart className="text-2xl" />
              </span>
              <span>Chi tiết đơn hàng #{order.id}</span>
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-8">
            {/* Order & Shipping Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                  <FiInfo className="mr-2 text-indigo-500" /> Thông tin đơn hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2" />
                      <span>Ngày đặt:</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {formatDate(order.date)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div className="flex items-center text-gray-600">
                      <div className="mr-2">{order.statusIcon}</div>
                      <span>Trạng thái:</span>
                    </div>
                    <span
                      className={`font-medium ${order.statusColor.replace(
                        "bg-",
                        "text-"
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <FiCreditCard className="mr-2" />
                      <span>Phương thức thanh toán:</span>
                    </div>
                    <span className="font-medium text-gray-800">COD</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                  <FiTruck className="mr-2 text-indigo-500" /> Thông tin giao
                  hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start pb-3 border-b border-gray-100">
                    <FiUser className="mt-1 mr-2 text-gray-600" />
                    <div>
                      <p className="text-gray-600">Người nhận</p>
                      <p className="font-medium text-gray-800">
                        {order.recipient}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start pb-3 border-b border-gray-100">
                    <FiMapPin className="mt-1 mr-2 text-gray-600" />
                    <div>
                      <p className="text-gray-600">Địa chỉ</p>
                      <p className="font-medium text-gray-800">
                        {order.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiPhone className="mt-1 mr-2 text-gray-600" />
                    <div>
                      <p className="text-gray-600">Số điện thoại</p>
                      <p className="font-medium text-gray-800">{order.phone}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-gray-600">
                      <span>Phí vận chuyển:</span>
                    </div>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-6 border-b pb-2 border-gray-200">
                🛒 Sản phẩm đã đặt
              </h3>
              <div className="space-y-6">
                {Array.isArray(selectedOrder?.items) &&
                  selectedOrder.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex gap-6">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-xl border border-gray-200 bg-white shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg mb-2">
                            {item.name}
                          </p>
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
                            <div>
                              <p className="text-gray-500">RAM</p>
                              <p className="font-medium">{item.ramValue}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">SSD</p>
                              <p className="font-medium">
                                {item.hardDriveValue}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Màu sắc</p>
                              <p className="font-medium">{item.colorName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Số lượng</p>
                              <p className="font-medium">x{item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-600 text-sm">
                              Đơn giá:{" "}
                              <span className="font-medium">
                                {formatPrice(item.price)}
                              </span>
                            </p>
                            <p className="font-bold text-indigo-600 text-xl">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <RatingBox />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Tổng cộng */}
            <div className="p-6 mt-8 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-2xl">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex flex-col items-end">
                  <p className="text-gray-600 text-sm">Tổng cộng</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OrderDetails;
