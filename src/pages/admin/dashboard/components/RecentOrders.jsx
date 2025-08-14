import { formatDate } from "date-fns";
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { apiGetOrderList } from "~/apis/orderApi";
import { formatPrice } from "~/utils/helper";
import { useSelector } from "react-redux";
import { showToastError } from "~/utils/alert";
import { getStatusInfo } from "../../orders/utils/helper";
import { getPaymentMethodStyle } from "../../orders/utils/orderHelper";
import { Link } from "react-router-dom";
const RecentOrders = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        size: 5,
      };

      const response = await apiGetOrderList({
        accessToken,
        params,
      });
      if (response.code === 200) {
        setFilteredOrders(response.data.content || []);
      } else {
        throw new Error(response.message || "Lỗi khi tải danh sách đơn hàng");
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [accessToken]);
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaShoppingCart className="mr-3 text-blue-600" />
            Đơn hàng gần đây
          </h2>
          <Link
            to="/admin/orders/management"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaEye className="mr-2" />
            Xem tất cả
          </Link>
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
