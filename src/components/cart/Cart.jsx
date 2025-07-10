import React, { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Laptop } from "lucide-react";
import { formatPrice } from "~/utils/helper";

const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  console.log("Cart items:", cartItems.length);
  // Handle select all items
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle select individual item
  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Update quantity - use parent function
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    if (onUpdateQuantity) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  // Remove item from cart - use parent function
  const removeItem = (itemId) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  // Calculate total for selected items
  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calculate total quantity for selected items
  const calculateSelectedQuantity = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Cart Panel */}
      <div
        className="fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Giỏ hàng
            </h2>
            {cartItems.length > 0 && (
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                {cartItems.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X size={20} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
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
          ) : (
            <>
              {/* Select All */}
              <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-cyan-50">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === cartItems.length &&
                        cartItems.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-offset-2"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                      Chọn tất cả ({cartItems.length} sản phẩm)
                    </span>
                  </label>
                </div>
              </div>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 transition-all duration-200 shadow-sm hover:shadow-md ${
                      selectedItems.includes(item.id)
                        ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-blue-100"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) =>
                          handleSelectItem(item.id, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-2 mt-1"
                      />

                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400 flex items-center justify-center">
                            <Laptop className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
                          {item.name}
                        </h4>

                        {/* Color Display */}
                        {item.color && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs text-gray-500">Màu:</span>
                            <div className="flex items-center space-x-1">
                              <div
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                                style={{
                                  backgroundColor: item.colorCode || "#gray",
                                }}
                              ></div>
                              <span className="text-xs font-medium text-gray-600">
                                {item.color}
                              </span>
                            </div>
                          </div>
                        )}

                        <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 bg-gray-50 rounded-full p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus
                                size={12}
                                className="text-gray-600 hover:text-red-500"
                              />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-700 bg-white rounded px-2 py-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                            >
                              <Plus
                                size={12}
                                className="text-gray-600 hover:text-green-500"
                              />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-2 text-right">
                          <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Tổng: {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t bg-gradient-to-r from-slate-50 to-gray-50 p-4 space-y-3">
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
              <span className="text-lg font-bold text-gray-800">
                Tổng cộng:
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(calculateSelectedTotal())}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              disabled={selectedItems.length === 0}
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
        )}
      </div>
    </>
  );
};

export default Cart;
