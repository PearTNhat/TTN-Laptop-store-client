import React from "react";
import {
  FaClock,
  FaCheck,
  FaTruck,
  FaBoxOpen,
  FaTimes,
  FaSpinner,
  FaShippingFast,
} from "react-icons/fa";

const ItemStatusBadge = ({ status, onClick, editable = false }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Chờ xử lý",
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <FaClock className="w-3 h-3" />,
        };
      case "AWAITING":
        return {
          text: "Đang chờ",
          color: "bg-orange-100 text-orange-800 border-orange-300",
          icon: <FaClock className="w-3 h-3" />,
        };
      case "PROCESSING":
        return {
          text: "Đang xử lý",
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <FaSpinner className="w-3 h-3 animate-spin" />,
        };
      case "PARTIALLY_DELIVERED":
        return {
          text: "Giao một phần",
          color: "bg-purple-100 text-purple-800 border-purple-300",
          icon: <FaShippingFast className="w-3 h-3" />,
        };
      case "DELIVERED":
        return {
          text: "Đã giao hàng",
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <FaTruck className="w-3 h-3" />,
        };
      case "COMPLETED":
        return {
          text: "Hoàn thành",
          color: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: <FaCheck className="w-3 h-3" />,
        };
      case "CANCELED":
        return {
          text: "Đã hủy",
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <FaTimes className="w-3 h-3" />,
        };
      default:
        return {
          text: "Không xác định",
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: <FaClock className="w-3 h-3" />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
        config.color
      } ${
        editable
          ? "cursor-pointer hover:shadow-md hover:scale-105"
          : "cursor-default"
      }`}
      onClick={editable ? onClick : undefined}
      title={editable ? "Click để thay đổi trạng thái" : config.text}
    >
      {config.icon}
      <span>{config.text}</span>
      {editable && (
        <svg
          className="w-3 h-3 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </span>
  );
};

export default ItemStatusBadge;
