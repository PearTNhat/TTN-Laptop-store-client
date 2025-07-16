import React from "react";
import { ShoppingBag } from "lucide-react";

const CartEmptyState = ({ isOpen }) => {
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-4 text-center transform transition-all duration-700 ${
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
      style={{
        transitionDelay: isOpen ? "300ms" : "0ms",
      }}
    >
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
        <ShoppingBag className="w-12 h-12 text-gradient bg-gradient-to-r from-blue-500 to-purple-600" />
      </div>
      <h3 className="text-lg font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-2">
        Giỏ hàng trống
      </h3>
      <p className="text-gray-400 text-sm">
        Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
      </p>
    </div>
  );
};

export default CartEmptyState;
