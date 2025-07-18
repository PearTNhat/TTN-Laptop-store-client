import React from "react";

const CartSelectAll = ({ isOpen, selectedItems, cartItems, onSelectAll }) => {
  return (
    <div
      className={`p-4 border-b bg-gradient-to-r from-emerald-50 to-cyan-50 transform transition-all duration-400 ${
        isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
      }`}
      style={{
        transitionDelay: isOpen ? "100ms" : "0ms",
      }}
    >
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={
              selectedItems.length === cartItems.length && cartItems.length > 0
            }
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-offset-2"
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
            Chọn tất cả ({cartItems.length} sản phẩm)
          </span>
        </label>
      </div>
    </div>
  );
};

export default CartSelectAll;
