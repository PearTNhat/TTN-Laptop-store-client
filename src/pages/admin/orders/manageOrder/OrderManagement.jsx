import React, { useState, useEffect, useMemo } from "react";
// Đảm bảo import đủ icon
import {
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { getPaymentMethodStyle } from "../utils/orderHelper";
import { formatPrice } from "~/utils/helper";
import {
  apiGetOrderList,
  apiGetOrderDetail,
  apiChangeStatusOrder,
} from "~/apis/orderApi";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { useSearchParams } from "react-router-dom";
import Pagination from "~/components/pagination/Pagination";
import { useSelector } from "react-redux";
import SimpleConfirmModal from "./components/SimpleConfirmModal";
import OrderDetailModal from "./components/OrderDetailModal";
import { getStatusInfo } from "../utils/helper";
import { formatDate } from "date-fns";

const OrderManagement = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentParams.page || 1,
        size: currentParams.size || 10,
        status:
          currentParams.status !== "all"
            ? currentParams?.status?.toUpperCase()
            : undefined,
        code: currentParams.q || undefined,
      };
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
      );
      const response = await apiGetOrderList({
        accessToken,
        params: cleanParams,
      });
      if (response.code === 200) {
        setFilteredOrders(response.data.content || []);
        setPagination({
          currentPage: response.data.pageNumber + 1,
          totalPages: response.data.totalPages,
        });
      } else {
        throw new Error(response.message || "Lỗi khi tải danh sách đơn hàng");
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    setDetailLoading(true);
    try {
      const response = await apiGetOrderDetail({ accessToken, id: orderId });
      if (response.code === 200) {
        setOrderDetail(response.data);
        setShowDetailModal(true);
      } else {
        throw new Error(response.message || "Lỗi khi tải chi tiết đơn hàng");
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await apiChangeStatusOrder({
        accessToken,
        id: orderId,
        status: newStatus,
      });
      if (response.code === 200) {
        showToastSuccess("Cập nhật trạng thái đơn hàng thành công!");
        fetchOrders();
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật trạng thái");
      }
    } catch (error) {
      showToastError(error.message);
    }
  };
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newStatus === "all") {
        newParams.delete("status");
      } else {
        newParams.set("page", "1");
        newParams.set("status", newStatus);
      }
      return newParams;
    });
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (searchTerm.trim()) {
          newParams.set("q", searchTerm.trim());
          newParams.set("page", "1");
        } else {
          newParams.delete("q");
        }
        return newParams;
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentParams]);

  const handlePageChange = (page) =>
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
  const handleProcessingOrder = (order) =>
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận đơn hàng",
      message: `Bạn có chắc chắn muốn xác nhận đơn hàng ${order.code}?`,
      onConfirm: () => {
        changeOrderStatus(order.id, "PROCESSING");
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });

  const handleCancelOrder = (order) =>
    setConfirmModal({
      isOpen: true,
      title: "Hủy đơn hàng",
      message: `Bạn có chắc chắn muốn hủy đơn hàng ${order.code}? Thao tác này không thể hoàn tác.`,
      onConfirm: () => {
        changeOrderStatus(order.id, "CANCELED");
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  const handleMarkAsCompleted = (order) =>
    setConfirmModal({
      isOpen: true,
      title: "Hoàn thành đơn hàng",
      message: `Xác nhận đơn hàng ${order.code} đã hoàn tất (đã giao và thanh toán)?`,
      onConfirm: () => {
        changeOrderStatus(order.id, "COMPLETED");
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Quản lý đơn hàng</h1>
          <p className="text-blue-100">
            Theo dõi và cập nhật trạng thái đơn hàng
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng, tên, SĐT..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={currentParams.status}
              onChange={handleStatusChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="awaiting">Chờ xác nhận</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="processing">Đang xử lý</option>
              <option value="partially_delivered">Đã giao một phần</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="canceled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const paymentStyle = getPaymentMethodStyle(
                    order.paymentMethod
                  );
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-600">
                          {order.code}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStyle.className}`}
                        >
                          <span>{paymentStyle.icon}</span>
                          {paymentStyle.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-green-600">
                          {formatPrice(order.totalPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          SL: {order.totalQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order?.createdDate
                            ? formatDate(
                                new Date(order.createdDate),
                                "dd/MM/yyyy"
                              )
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order?.createdDate
                            ? formatDate(
                                new Date(order.createdDate),
                                "HH:mm:ss"
                              )
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => fetchOrderDetail(order.id)}
                            disabled={detailLoading}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          {order.status === "AWAITING" && (
                            <>
                              <button
                                onClick={() => handleProcessingOrder(order)}
                                className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50"
                                title="Xác nhận & Xử lý đơn hàng"
                              >
                                <FaCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                                title="Hủy đơn hàng"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {order.status === "PARTIALLY_DELIVERED" && (
                            <>
                              <button
                                onClick={() => handleMarkAsCompleted(order)}
                                className="text-cyan-600 hover:text-cyan-800 p-2 rounded-full hover:bg-cyan-50"
                                title="Đánh dấu đã giao hàng"
                              >
                                <FaTruck className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {order.status === "DELIVERED" && (
                            <button
                              onClick={() => handleMarkAsCompleted(order)}
                              className="text-purple-600 hover:text-purple-800 p-2 rounded-full hover:bg-purple-50"
                              title="Đánh dấu đã hoàn thành"
                            >
                              <FaCheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={pagination.currentPage}
          totalPageCount={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {showDetailModal && orderDetail && (
        <OrderDetailModal
          order={orderDetail}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setOrderDetail(null);
          }}
        />
      )}
      <SimpleConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
};

export default OrderManagement;
