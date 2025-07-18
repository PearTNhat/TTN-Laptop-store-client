import React from "react";
import { X, ShoppingBag } from "lucide-react";

const CartHeader = ({ isOpen, onClose, cartItemsLength }) => {
  return (
    <div
      className={`flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 transform transition-all duration-500 ${
        isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Giỏ hàng
        </h2>
        {cartItemsLength > 0 && (
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            {cartItemsLength}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
      >
        <X size={20} className="text-gray-600 hover:text-red-500" />
      </button>
    </div>
  );
};

export default CartHeader;
