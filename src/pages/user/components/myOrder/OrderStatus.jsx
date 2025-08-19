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
  DELIVERED: <FiTruck className="text-green-500" />,
  COMPLETED: <FiCheckCircle className="text-green-600" />,
  CANCELED: <FiX className="text-red-500" />,
};

export const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  AWAITING: "bg-orange-100 text-orange-800 border-orange-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-green-200 text-green-900 border-green-300",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
};

export const statusBadges = {
  PENDING: "bg-yellow-500/10 text-yellow-800 border border-yellow-300",
  AWAITING: "bg-orange-500/10 text-orange-800 border border-orange-300",
  PROCESSING: "bg-blue-500/10 text-blue-800 border border-blue-300",
  DELIVERED: "bg-green-500/10 text-green-800 border border-green-300",
  COMPLETED: "bg-green-600/10 text-green-900 border border-green-400",
  CANCELED: "bg-red-500/10 text-red-800 border border-red-300",
};

export const statusDisplayMap = {
  PENDING: "Chờ thanh toán",
  AWAITING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  DELIVERED: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELED: "Đã hủy",
};

export const getStatusInfo = (statusKey) => {
  return {
    display: statusDisplayMap[statusKey] || statusKey,
    color: statusColors[statusKey] || "bg-gray-100 text-gray-800 border-gray-200",
    badge: statusBadges[statusKey] || "bg-gray-100 text-gray-800 border border-gray-300",
    icon: statusIcons[statusKey] || <FiInfo />,
  };
};

export const mapApiOrderToState = (apiOrder) => {
  const statusKey = apiOrder.status;

  const statusInfo = {
    display: statusDisplayMap[statusKey] || statusKey,
    color:
      statusColors[statusKey] || "bg-gray-100 text-gray-800 border-gray-200",
    badge:
      statusBadges[statusKey] ||
      "bg-gray-100 text-gray-800 border border-gray-300",
      icon: statusIcons[statusKey] || <FiInfo />,
    };

    return {
      idOrder: Number(apiOrder.id),
      code: apiOrder.code,
      date: apiOrder.createdAt,
      status: statusInfo.display, // dùng cho UI
      statusfilter: statusKey, // dùng cho lọc
      statusColor: statusInfo.color,
      statusBadge: statusInfo.badge,
      statusIcon: statusInfo.icon,
      recipient: apiOrder.recipient,
      address: apiOrder.address,
      phone: apiOrder.phone,

      paymentMethod: apiOrder.paymentMethod,
      note: apiOrder.note,
      payUrl: apiOrder.payUrl,

      totalQuantity: apiOrder.totalQuantity,
      total: apiOrder.totalPrice,
      shopDiscount: apiOrder.shopDiscount,
      userDiscount: apiOrder.userDiscount,

      items: apiOrder.orderDetails.map((detail) => ({
        idproductDetail: detail.productDetailId,
        idproduct: detail.productId,
        name: detail.title,
        price: detail.price,
        originalPrice: detail.originalPrice,
        quantity: detail.quantity,
        ramValue: detail.ramValue,
        hardDriveValue: detail.hardDriveValue,
        colorName: detail.colorName,
        thumbnail: detail.thumbnail,
        description: detail.description,
      })),
    };
  };
