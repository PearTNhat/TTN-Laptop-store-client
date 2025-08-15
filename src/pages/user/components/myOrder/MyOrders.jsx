import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiInfo,
  FiTruck,
  FiCheckCircle,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { apiGetOrders } from "~/apis/orderApi";
import { formatPrice, formatDate } from "~/utils/helper";
import OrderItem from "./OrderItem";
import OrderDetails from "./OrderDetail";

import { mapApiOrderToState } from "./OrderStatus";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { accessToken } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await apiGetOrders({ accessToken, page, size });
        console.log("res orders: ", res);
        if (res.code === 200) {
          const mappedOrders = res.data.content.map(mapApiOrderToState);
          setOrders(mappedOrders);
          setTotalPages(res.data.totalPages);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken, page, size]);

  const handleDetail = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-2xl mx-auto">
        <div className="mx-auto max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShoppingCart className="text-4xl text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Bạn chưa có đơn hàng nào
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Hãy bắt đầu mua sắm để xem các đơn hàng tại đây
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all text-lg font-medium shadow-md">
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl shadow-md mr-4">
            <FiShoppingCart className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Đơn hàng của tôi
            </h2>
            <p className="text-gray-600 mt-1">
              Quản lý và theo dõi đơn hàng của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <OrderItem order={order} onDetail={handleDetail} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  page === i
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <OrderDetails
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default MyOrders;
