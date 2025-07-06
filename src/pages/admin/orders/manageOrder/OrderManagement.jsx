import React, { useState, useEffect, Fragment } from "react";
import { FaSearch, FaDownload, FaEye, FaEyeSlash } from "react-icons/fa";
import ItemStatusBadge from "./components/ItemStatusBadge";
import ConfirmModal from "../../../../components/modal/ConfirmModal";
import { getPaymentMethodStyle } from "../utils/orderHelper";
import { formatPrice } from "~/utils/helper";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - thay thế bằng API thực tế
  useEffect(() => {
    fetchOrders();
  }, []);
  console.log("rendered");
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockOrders = [
        {
          id: "ORD-001",
          customerName: "Nguyễn Văn A",
          customerEmail: "nguyenvana@email.com",
          customerPhone: "0123456789",
          orderDate: "2024-01-15T10:30:00Z",
          totalAmount: 25000000,
          status: "processing",
          paymentMethod: "credit_card",
          paymentStatus: "paid",
          shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
          notes: "Khách hàng yêu cầu giao hàng vào cuối tuần",
          cancelReason: "",
          items: [
            {
              id: "item-1",
              productId: "laptop-001",
              productName: "Dell XPS 13 Plus",
              productImage: "/images/dell-xps-13.jpg",
              quantity: 1,
              price: 25000000,
              status: "processing",
              specifications: {
                CPU: "Intel Core i7-1260P",
                RAM: "16GB",
                Storage: "512GB SSD",
              },
              notes: "haha",
            },
          ],
        },
        {
          id: "ORD-002",
          customerName: "Trần Thị B",
          customerEmail: "tranthib@email.com",
          customerPhone: "0987654321",
          orderDate: "2024-01-14T15:20:00Z",
          totalAmount: 45000000,
          status: "shipping",
          paymentMethod: "bank_transfer",
          paymentStatus: "paid",
          shippingAddress: "456 Đường XYZ, Quận 2, TP.HCM",
          notes: "",
          cancelReason: "",
          items: [
            {
              id: "item-2",
              productId: "laptop-002",
              productName: 'MacBook Pro 14"',
              productImage: "/images/macbook-pro-14.jpg",
              quantity: 1,
              price: 45000000,
              status: "shipping",
              specifications: {
                CPU: "Apple M2 Pro",
                RAM: "16GB",
                Storage: "512GB SSD",
              },
              notes: "Giao trong giờ hành chính",
            },
          ],
        },
        {
          id: "ORD-003",
          customerName: "Lê Văn C",
          customerEmail: "levanc@email.com",
          customerPhone: "0912345678",
          orderDate: "2024-01-16T09:15:00Z",
          totalAmount: 18000000,
          status: "confirmed",
          paymentMethod: "cash",
          paymentStatus: "pending",
          shippingAddress: "789 Đường DEF, Quận 3, TP.HCM",
          notes: "Thanh toán khi nhận hàng",
          cancelReason: "",
          items: [
            {
              id: "item-3",
              productId: "laptop-003",
              productName: "Asus VivoBook 15",
              productImage: "/images/asus-vivobook.jpg",
              quantity: 1,
              price: 18000000,
              status: "confirmed",
              specifications: {
                CPU: "Intel Core i5-1135G7",
                RAM: "8GB",
                Storage: "256GB SSD",
              },
              notes: "",
            },
            {
              id: "item-99",
              productId: "laptop-003",
              productName: "Asus VivoBook 15",
              productImage: "/images/asus-vivobook.jpg",
              quantity: 1,
              price: 18000000,
              status: "confirmed",
              specifications: {
                CPU: "Intel Core i5-1135G7",
                RAM: "8GB",
                Storage: "256GB SSD",
              },
              notes: "",
            },
          ],
        },
        {
          id: "ORD-004",
          customerName: "Phạm Thị D",
          customerEmail: "phamthid@email.com",
          customerPhone: "0934567890",
          orderDate: "2024-01-16T14:30:00Z",
          totalAmount: 35000000,
          status: "delivered",
          paymentMethod: "momo",
          paymentStatus: "paid",
          shippingAddress: "321 Đường GHI, Quận 4, TP.HCM",
          notes: "Giao hàng thành công",
          cancelReason: "",
          items: [
            {
              id: "item-4",
              productId: "laptop-004",
              productName: "HP Pavilion Gaming",
              productImage: "/images/hp-pavilion.jpg",
              quantity: 1,
              price: 35000000,
              status: "delivered",
              specifications: {
                CPU: "AMD Ryzen 7 5800H",
                RAM: "16GB",
                Storage: "1TB SSD",
              },
              notes: "",
            },
          ],
        },
        {
          id: "ORD-005",
          customerName: "Hoàng Văn E",
          customerEmail: "hoangvane@email.com",
          customerPhone: "0945678901",
          orderDate: "2024-01-17T11:45:00Z",
          totalAmount: 55000000,
          status: "cancelled",
          paymentMethod: "vnpay",
          paymentStatus: "refunded",
          shippingAddress: "654 Đường JKL, Quận 5, TP.HCM",
          notes: "",
          cancelReason: "Khách hàng không muốn mua nữa",
          items: [
            {
              id: "item-5",
              productId: "laptop-005",
              productName: "Lenovo Legion 5",
              productImage: "/images/lenovo-legion.jpg",
              quantity: 1,
              price: 55000000,
              status: "cancelled",
              specifications: {
                CPU: "Intel Core i7-12700H",
                RAM: "32GB",
                Storage: "1TB SSD",
              },
              notes: "",
            },
          ],
        },
        {
          id: "ORD-006",
          customerName: "Nguyễn Thị F",
          customerEmail: "nguyenthif@email.com",
          customerPhone: "0956789012",
          orderDate: "2024-01-14T08:20:00Z",
          totalAmount: 28000000,
          status: "shipping",
          paymentMethod: "zalopay",
          paymentStatus: "paid",
          shippingAddress: "987 Đường MNO, Quận 6, TP.HCM",
          notes: "Giao hàng trong giờ hành chính",
          cancelReason: "",
          items: [
            {
              id: "item-6",
              productId: "laptop-006",
              productName: "Acer Aspire 7",
              productImage: "/images/acer-aspire.jpg",
              quantity: 1,
              price: 28000000,
              status: "shipping",
              specifications: {
                CPU: "AMD Ryzen 5 5500U",
                RAM: "8GB",
                Storage: "512GB SSD",
              },
              notes: "",
            },
          ],
        },
      ];

      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } catch {
      ConfirmModal.error({
        title: "Lỗi!",
        text: "Không thể tải danh sách đơn hàng. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const handleUpdateOrderStatus = async (orderId) => {
    // Nếu chọn hủy đơn hàng, yêu cầu nhập lý do
    const result = await ConfirmModal.withSelect({
      title: "Cập nhật trạng thái đơn hàng",
      text: `Cập nhật trạng thái cho đơn hàng ${orderId}`,
      inputOptions: {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        processing: "Đang xử lý",
        shipping: "Đang giao",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
        returned: "Đã trả",
      },
      confirmButtonText: "Cập nhật",
      confirmButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      let cancelReason = "";

      // Nếu chọn hủy đơn hàng, yêu cầu nhập lý do
      if (result.value === "cancelled") {
        const reasonResult = await ConfirmModal.withInput({
          title: "Lý do hủy đơn hàng",
          text: `Vui lòng nhập lý do hủy đơn hàng ${orderId}:`,
          inputPlaceholder: "Nhập lý do hủy...",
          confirmButtonText: "Xác nhận hủy",
          confirmButtonColor: "#dc3545",
        });

        if (!reasonResult.isConfirmed) {
          return; // Hủy bỏ nếu không nhập lý do
        }

        cancelReason = reasonResult.value;
      }

      try {
        setLoading(true);
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: result.value,
                  cancelReason:
                    result.value === "cancelled"
                      ? cancelReason
                      : order.cancelReason,
                }
              : order
          )
        );

        ConfirmModal.toast({
          icon: "success",
          title: "Cập nhật trạng thái thành công!",
        });
      } catch {
        ConfirmModal.error({
          title: "Lỗi!",
          text: "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại!",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  const handleUpdateItemStatus = async (item) => {
    const result = await ConfirmModal.withSelect({
      title: "Cập nhật trạng thái sản phẩm",
      text: `Cập nhật trạng thái cho sản phẩm: ${item.productName}`,
      inputOptions: {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        processing: "Đang xử lý",
        shipping: "Đang giao",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
        returned: "Đã trả",
      },
      confirmButtonText: "Cập nhật",
      confirmButtonColor: "#3085d6",
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setOrders((prevOrders) =>
          prevOrders.map((order) => ({
            ...order,
            items: order.items.map((orderItem) =>
              orderItem.id === item.id
                ? {
                    ...orderItem,
                    status: result.value,
                  }
                : orderItem
            ),
          }))
        );

        ConfirmModal.toast({
          icon: "success",
          title: "Cập nhật trạng thái sản phẩm thành công!",
        });
      } catch {
        ConfirmModal.error({
          title: "Lỗi!",
          text: "Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại!",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Group orders by date
  const groupOrdersByDate = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const date = new Date(order.orderDate).toLocaleDateString("vi-VN");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(order);
      return acc;
    }, {});

    // Sort dates in descending order (newest first)
    const sortedEntries = Object.entries(grouped).sort((a, b) => {
      const dateA = new Date(a[1][0].orderDate);
      const dateB = new Date(b[1][0].orderDate);
      return dateB - dateA;
    });

    return sortedEntries;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Quản lý đơn hàng</h1>
          <p className="text-blue-100">
            Theo dõi và cập nhật trạng thái đơn hàng
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
              <option value="returned">Đã trả</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                ConfirmModal.toast({
                  icon: "info",
                  title: "Chức năng xuất Excel đang được phát triển",
                });
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
            >
              <FaDownload className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Ghi chú
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
                // Group orders by date and render
                groupOrdersByDate(filteredOrders).map(
                  ([date, ordersInDate]) => (
                    <React.Fragment key={date}>
                      {/* Date Header Row */}
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <td colSpan="8" className="px-6 py-4 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-gray-800">
                                📅 {date}
                              </span>
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                {ordersInDate.length} đơn hàng
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                💰 Tổng:{" "}
                                {formatPrice(
                                  ordersInDate.reduce(
                                    (sum, order) => sum + order.totalAmount,
                                    0
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {/* Orders for this date */}
                      {ordersInDate.map((order) => {
                        const paymentStyle = getPaymentMethodStyle(
                          order.paymentMethod
                        );
                        return (
                          <Fragment key={order.id}>
                            {/* Order Row */}
                            <tr className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4">
                                <span className="font-bold text-blue-600">
                                  #{order.id}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {order.customerName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {order.customerEmail}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {order.customerPhone}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${paymentStyle.className}`}
                                >
                                  <span>{paymentStyle.icon}</span>
                                  {paymentStyle.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                {order.shippingAddress}
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-green-600">
                                  {formatPrice(order.totalAmount)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                <div>
                                  {order.notes && (
                                    <p className="text-blue-600 text-xs mb-1">
                                      📝 {order.notes}
                                    </p>
                                  )}
                                  {order.status === "cancelled" &&
                                    order.cancelReason && (
                                      <p className="text-red-600 text-xs">
                                        ❌ {order.cancelReason}
                                      </p>
                                    )}
                                  {!order.notes &&
                                    order.status !== "cancelled" && (
                                      <span className="text-gray-400 text-xs italic">
                                        Không có ghi chú
                                      </span>
                                    )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <ItemStatusBadge
                                  status={order.status}
                                  editable={true}
                                  onClick={() =>
                                    handleUpdateOrderStatus(order.id)
                                  }
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1 mx-auto"
                                  onClick={() =>
                                    setSelectedOrder(
                                      selectedOrder === order.id
                                        ? null
                                        : order.id
                                    )
                                  }
                                >
                                  {selectedOrder === order.id ? (
                                    <>
                                      <FaEyeSlash className="w-3 h-3" />
                                      Ẩn
                                    </>
                                  ) : (
                                    <>
                                      <FaEye className="w-3 h-3" />
                                      Xem
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>

                            {/* Order Details Row */}
                            {selectedOrder === order.id && (
                              <tr>
                                <td
                                  colSpan="8"
                                  className="px-6 py-4 bg-gray-50"
                                >
                                  <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                      Chi tiết đơn hàng ({order.items.length}{" "}
                                      sản phẩm)
                                    </h4>

                                    {/* Products Table */}
                                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                      <table className="w-full">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                              Sản phẩm
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                              Đơn giá
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                              Số lượng
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                              Thành tiền
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                              Trạng thái
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {order.items.map((item) => (
                                            <tr
                                              key={item.id}
                                              className="hover:bg-gray-50"
                                            >
                                              <td className="px-4 py-3">
                                                <div className="flex items-center space-x-3">
                                                  <img
                                                    src={
                                                      item.productImage ||
                                                      "/images/default-product.png"
                                                    }
                                                    alt={item.productName}
                                                    className="w-12 h-12 object-cover rounded-lg border"
                                                    onError={(e) => {
                                                      e.target.src =
                                                        "/images/default-product.png";
                                                    }}
                                                  />
                                                  <div>
                                                    <p className="font-medium text-gray-900">
                                                      {item.productName}
                                                    </p>
                                                    {item.specifications && (
                                                      <p className="text-xs text-gray-500">
                                                        {Object.entries(
                                                          item.specifications
                                                        )
                                                          .map(
                                                            ([key, value]) =>
                                                              `${key}: ${value}`
                                                          )
                                                          .join(" | ")}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-900">
                                                {formatPrice(item.price)}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-900">
                                                {item.quantity}
                                              </td>
                                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {formatPrice(
                                                  item.price * item.quantity
                                                )}
                                              </td>
                                              <td className="px-4 py-3">
                                                <ItemStatusBadge
                                                  status={item.status}
                                                  editable={true}
                                                  onClick={() =>
                                                    handleUpdateItemStatus(item)
                                                  }
                                                />
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </React.Fragment>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
