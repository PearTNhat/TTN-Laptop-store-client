import {
  FiCheckCircle,
  FiInfo,
  FiTruck,
  FiX,
  FiClock,
  FiSettings,
  FiPackage,
} from "react-icons/fi";

export const statusIcons = {
  PENDING: <FiInfo className="text-yellow-500" />,
  AWAITING: <FiClock className="text-orange-500" />,
  PROCESSING: <FiSettings className="text-blue-500" />,
  PARTIALLY_DELIVERED: <FiPackage className="text-indigo-500" />,
  DELIVERED: <FiTruck className="text-green-500" />,
  COMPLETED: <FiCheckCircle className="text-green-600" />,
  CANCELED: <FiX className="text-red-500" />,
};

export const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  AWAITING: "bg-orange-100 text-orange-800 border-orange-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  PARTIALLY_DELIVERED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-green-200 text-green-900 border-green-300",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
};

export const statusBadges = {
  PENDING: "bg-yellow-500/10 text-yellow-800 border border-yellow-300",
  AWAITING: "bg-orange-500/10 text-orange-800 border border-orange-300",
  PROCESSING: "bg-blue-500/10 text-blue-800 border border-blue-300",
  PARTIALLY_DELIVERED: "bg-indigo-500/10 text-indigo-800 border border-indigo-300",
  DELIVERED: "bg-green-500/10 text-green-800 border border-green-300",
  COMPLETED: "bg-green-600/10 text-green-900 border border-green-400",
  CANCELED: "bg-red-500/10 text-red-800 border border-red-300",
};

export const statusDisplayMap = {
  PENDING: "Chờ xác nhận",
  AWAITING: "Đang chờ xử lý",
  PROCESSING: "Đang xử lý",
  PARTIALLY_DELIVERED: "Giao một phần",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn thành",
  CANCELED: "Đã hủy",
};

export const mapApiOrderToState = (apiOrder) => {
  console.log("Raw order from API:", JSON.stringify(apiOrder, null, 2)); // Debug dữ liệu API thô
  const statusKey = apiOrder.status;

  const statusInfo = {
    display: statusDisplayMap[statusKey] || statusKey,
    color: statusColors[statusKey] || "bg-gray-100 text-gray-800 border-gray-200",
    badge: statusBadges[statusKey] || "bg-gray-100 text-gray-800 border border-gray-300",
    icon: statusIcons[statusKey] || <FiInfo />,
  };

  const mappedOrder = {
    id: apiOrder.id,
    code: apiOrder.code,
    date: apiOrder.createdAt,
    status: statusInfo.display,
    statusColor: statusInfo.color,
    statusBadge: statusInfo.badge,
    statusIcon: statusInfo.icon,
    recipient: apiOrder.recipient,
    address: apiOrder.address,
    phone: apiOrder.phone,
    items: (apiOrder.orderDetails || apiOrder.items || []).map(detail => ({
      id: detail.id,
      title: detail.title || detail.name,
      price: detail.price,
      quantity: detail.quantity,
      ramValue: detail.ramValue,
      hardDriveValue: detail.hardDriveValue,
      colorName: detail.colorName,
      thumbnail: detail.thumbnail,
      description: detail.description,
      productDetailId: detail.productDetailId,
      serialNumber: detail.serialNumber,
    })),
    total: apiOrder.totalPrice,
  };
  console.log("Mapped order:", JSON.stringify(mappedOrder, null, 2)); // Debug order đã ánh xạ
  return mappedOrder;
};
