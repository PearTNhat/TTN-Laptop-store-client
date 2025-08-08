// Trong file utils/helper.js

// Thêm các icon mới vào dòng import
import {
  FaClock,
  FaTimes,
  FaTruck,
  FaWallet,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";

const getStatusInfo = (status) => {
  switch (status) {
    case "PENDING":
      return {
        text: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: <FaClock className="w-3 h-3" />,
      };
    // MỚI: Trạng thái chờ thanh toán (ví dụ: chuyển khoản ngân hàng)
    case "AWAITING": // Hoặc "AWAITING", tùy vào API của bạn
      return {
        text: "Chờ xác nhận",
        className: "bg-orange-100 text-orange-800 border-orange-300",
        icon: <FaWallet className="w-3 h-3" />,
      };
    case "PROCESSING":
      return {
        text: "Đang xuất hàng",
        className: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <FaClock className="w-3 h-3" />,
      };
    // MỚI: Trạng thái đã giao một phần
    case "PARTIALLY_DELIVERED":
      return {
        text: "Giao một phần",
        className: "bg-indigo-100 text-indigo-800 border-indigo-300",
        icon: <FaBoxOpen className="w-3 h-3" />,
      };
    case "DELIVERED":
      return {
        text: "Đang giao hàng",
        className: "bg-cyan-100 text-cyan-800 border-cyan-300", // Đổi màu để phân biệt với Completed
        icon: <FaTruck className="w-3 h-3" />,
      };
    // MỚI: Trạng thái đã hoàn thành (khách đã nhận và thanh toán xong)
    case "COMPLETED":
      return {
        text: "Hoàn thành",
        className: "bg-green-100 text-green-800 border-green-300",
        icon: <FaCheckCircle className="w-3 h-3" />,
      };
    case "CANCELED":
      return {
        text: "Đã hủy",
        className: "bg-red-100 text-red-800 border-red-300",
        icon: <FaTimes className="w-3 h-3" />,
      };
    default:
      return {
        text: status,
        className: "bg-gray-100 text-gray-800 border-gray-300",
        icon: <FaClock className="w-3 h-3" />,
      };
  }
};

export { getStatusInfo };
