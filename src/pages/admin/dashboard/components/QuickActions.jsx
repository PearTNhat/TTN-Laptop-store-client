import React from "react";
import { FaUserPlus, FaPlus, FaShoppingCart, FaCog } from "react-icons/fa";
import { BsTicketPerforatedFill } from "react-icons/bs";

const QuickActions = () => {
  const actions = [
    {
      icon: (
        <FaUserPlus className="text-3xl text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10" />
      ),
      label: "Thêm người dùng",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      hoverColor: "hover:from-blue-100 hover:to-blue-200",
      overlayColor: "bg-gradient-to-br from-blue-600 to-blue-800",
      textColor: "text-blue-700",
    },
    {
      icon: (
        <FaPlus className="text-3xl text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10" />
      ),
      label: "Thêm sản phẩm",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      hoverColor: "hover:from-green-100 hover:to-green-200",
      overlayColor: "bg-gradient-to-br from-green-600 to-green-800",
      textColor: "text-green-700",
    },
    {
      icon: (
        <FaShoppingCart className="text-3xl text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10" />
      ),
      label: "Xem đơn hàng",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      hoverColor: "hover:from-purple-100 hover:to-purple-200",
      overlayColor: "bg-gradient-to-br from-purple-600 to-purple-800",
      textColor: "text-purple-700",
    },
    {
      icon: (
        <BsTicketPerforatedFill className="text-3xl text-yellow-600 mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10" />
      ),
      label: "Tạo khuyến mãi",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      hoverColor: "hover:from-yellow-100 hover:to-yellow-200",
      overlayColor: "bg-gradient-to-br from-yellow-600 to-yellow-800",
      textColor: "text-yellow-700",
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <FaCog className="mr-3 text-purple-600" />
        Thao tác nhanh
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`group relative overflow-hidden flex flex-col items-center p-6 ${action.bgColor} ${action.hoverColor} rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
          >
            <div
              className={`absolute inset-0 ${action.overlayColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>
            {action.icon}
            <span
              className={`text-sm font-semibold ${action.textColor} text-center relative z-10`}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
