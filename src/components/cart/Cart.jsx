import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartHeader from "./CartHeader";
import CartEmptyState from "./CartEmptyState";
import CartSelectAll from "./CartSelectAll";
import CartItemsList from "./CartItemsList";
import CartFooter from "./CartFooter";

const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
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

  // Handle checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    // Lấy các item đã chọn
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    // Format theo structure yêu cầu
    const formattedOrder = {
      items: selectedCartItems.map((item) => ({
        id: item.productDetailId || item.id,
        imageUrl: item.image || item.imageUrl,
        productName: item.name || item.title,
        quantity: item.quantity,
        discountPrice: item.price || item.discountPrice,
        originalPrice: item.originalPrice || item.price,
      })),
    };

    console.log("Checkout data:", formattedOrder);

    // Navigate to checkout với data
    navigate("/checkout", {
      state: {
        orderData: formattedOrder,
        source: "cart-checkout",
      },
    });

    // Đóng cart sau khi checkout
    onClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-[9999] flex flex-col transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <CartHeader
          isOpen={isOpen}
          onClose={onClose}
          cartItemsLength={cartItems.length}
        />
        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {cartItems.length === 0 ? (
            <CartEmptyState isOpen={isOpen} />
          ) : (
            <>
              <CartSelectAll
                isOpen={isOpen}
                selectedItems={selectedItems}
                cartItems={cartItems}
                onSelectAll={handleSelectAll}
              />

              <CartItemsList
                cartItems={cartItems}
                isOpen={isOpen}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            </>
          )}
        </div>
        {cartItems.length > 0 && (
          <CartFooter
            isOpen={isOpen}
            selectedItems={selectedItems}
            calculateSelectedTotal={calculateSelectedTotal}
            calculateSelectedQuantity={calculateSelectedQuantity}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </>
  );
};

export default Cart;
