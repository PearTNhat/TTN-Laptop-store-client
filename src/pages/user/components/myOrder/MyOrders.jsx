import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { apiGetOrders } from "~/apis/orderApi";
import OrderItem from "./OrderItem";
import OrderDetails from "./OrderDetail";
import { mapApiOrderToState, statusDisplayMap } from "./OrderStatus";
import Pagination from "~/components/pagination/Pagination";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { accessToken } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const pageSize = 5; // số đơn hàng mỗi trang

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await apiGetOrders({ accessToken, page: 0, size: 1000 }); // lấy tất cả
        if (res.code === 200) {
          const mappedOrders = res.data.content.map(mapApiOrderToState);
          setOrders(mappedOrders);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken]);

  const handleDetail = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = filterStatus
    ? orders.filter((order) => order.statusfilter === filterStatus)
    : orders;

  // Tính toán phân trang FE
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-b border-indigo-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg animate-pulse">
              <FiShoppingCart className="text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Đơn hàng của tôi
              </h2>
              <p className="text-gray-600 mt-1 text-sm italic">
                Quản lý và theo dõi đơn hàng của bạn một cách dễ dàng
              </p>
            </div>
          </div>

          {/* Dropdown lọc trạng thái */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // reset về trang 1
              }}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(statusDisplayMap).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="mt-6 divide-y divide-gray-100">
        {currentOrders.length > 0 ? (
          <AnimatePresence>
            {currentOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <OrderItem
                  order={order}
                  onDetail={handleDetail}
                  onStatusChange={(updatedOrder) => {
                    setOrders((prev) =>
                      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
                    );
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto max-w-md">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-600 mb-6 text-base">
                Không có đơn hàng nào khớp với bộ lọc bạn chọn
              </p>
              <button
                onClick={() => setFilterStatus("")}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all text-base font-medium shadow-md"
              >
                Xem tất cả đơn hàng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination FE */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPageCount={totalPages}
          onPageChange={setCurrentPage}
          siblingCount={1}
          showFirstLast
        />
      )}

      {/* Modal chi tiết đơn hàng */}
      <OrderDetails
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default MyOrders;
