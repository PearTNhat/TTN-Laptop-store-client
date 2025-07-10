import React from "react";
import {
  FaClock,
  FaCheck,
  FaTruck,
  FaBoxOpen,
  FaTimes,
  FaUndo,
} from "react-icons/fa";

const OrderStatusCard = ({
  status,
  count,
  color,
  onClick,
  isActive = false,
}) => {
  const getIcon = (status) => {
    switch (status) {
      case "all":
        return <FaBoxOpen className="text-2xl" />;
      case "pending":
        return <FaClock className="text-2xl" />;
      case "confirmed":
        return <FaCheck className="text-2xl" />;
      case "processing":
        return <FaBoxOpen className="text-2xl" />;
      case "shipping":
        return <FaTruck className="text-2xl" />;
      case "delivered":
        return <FaCheck className="text-2xl" />;
      case "cancelled":
        return <FaTimes className="text-2xl" />;
      case "returned":
        return <FaUndo className="text-2xl" />;
      default:
        return <FaClock className="text-2xl" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "all":
        return "Tất cả";
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      case "returned":
        return "Đã trả";
      default:
        return "Không xác định";
    }
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isActive
          ? `bg-gradient-to-r ${color} text-white shadow-xl`
          : "bg-white hover:shadow-xl border-2 border-transparent hover:border-blue-200"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-full ${
              isActive ? "bg-white bg-opacity-20" : "bg-gray-100"
            }`}
          >
            <div className={isActive ? "text-white" : "text-gray-600"}>
              {getIcon(status)}
            </div>
          </div>
          <div>
            <h3
              className={`font-semibold text-lg ${
                isActive ? "text-white" : "text-gray-800"
              }`}
            >
              {getStatusText(status)}
            </h3>
            <p
              className={`text-sm ${
                isActive ? "text-white text-opacity-80" : "text-gray-500"
              }`}
            >
              Đơn hàng
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`text-3xl font-bold ${
              isActive ? "text-white" : "text-gray-800"
            }`}
          >
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusCard;
