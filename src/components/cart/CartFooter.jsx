import React from "react";
import { formatPrice } from "~/utils/helper";

const CartFooter = ({
  isOpen,
  selectedItems,
  calculateSelectedTotal,
  calculateSelectedQuantity,
  onCheckout,
}) => {
  return (
    <div
      className={`border-t bg-gradient-to-r from-slate-50 to-gray-50 p-4 space-y-3 transform transition-all duration-500 ${
        isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{
        transitionDelay: isOpen ? "200ms" : "0ms",
      }}
    >
      {/* Selected Summary */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 font-medium">
          Đã chọn:{" "}
          <span className="text-blue-600 font-bold">
            {selectedItems.length}
          </span>{" "}
          sản phẩm (
          <span className="text-purple-600 font-bold">
            {calculateSelectedQuantity()}
          </span>{" "}
          món)
        </span>
      </div>

      {/* Total Price */}
      <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
        <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formatPrice(calculateSelectedTotal())}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        disabled={selectedItems.length === 0}
        onClick={onCheckout}
        className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
          selectedItems.length > 0
            ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {selectedItems.length > 0 ? (
          <span className="flex items-center justify-center space-x-2">
            <span>🛒</span>
            <span>Thanh toán ({selectedItems.length})</span>
            <span>✨</span>
          </span>
        ) : (
          "Chọn sản phẩm để thanh toán"
        )}
      </button>
    </div>
  );
};

export default CartFooter;
