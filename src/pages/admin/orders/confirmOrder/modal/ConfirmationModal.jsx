import React from "react";
import { FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Xác nhận",
  confirmColor = "blue",
}) => {
  if (!isOpen) return null;

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-600 hover:bg-blue-700",
        icon: "text-blue-500",
        iconBg: "bg-blue-100",
      },
      green: {
        bg: "bg-green-600 hover:bg-green-700",
        icon: "text-green-500",
        iconBg: "bg-green-100",
      },
      red: {
        bg: "bg-red-600 hover:bg-red-700",
        icon: "text-red-500",
        iconBg: "bg-red-100",
      },
      orange: {
        bg: "bg-orange-600 hover:bg-orange-700",
        icon: "text-orange-500",
        iconBg: "bg-orange-100",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(confirmColor);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${colors.iconBg}`}>
              {confirmColor === "red" ? (
                <FaExclamationTriangle className={`text-xl ${colors.icon}`} />
              ) : (
                <FaCheck className={`text-xl ${colors.icon}`} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg font-semibold transition-colors duration-200 ${colors.bg}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
