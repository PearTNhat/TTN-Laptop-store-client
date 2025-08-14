import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartHeader from "./CartHeader";
import CartEmptyState from "./CartEmptyState";
import CartSelectAll from "./CartSelectAll";
import CartItemsList from "./CartItemsList";
import CartFooter from "./CartFooter";
import { showAlertInfo } from "~/utils/alert";
import { useSelector } from "react-redux";
import { apiGetPromotionId } from "~/apis/promotionApi";
import { calculateFinalPrice } from "~/utils/promotion";
const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const { accessToken } = useSelector((state) => state.user);
  const [processedCartItems, setProcessedCartItems] = useState([]);
  useEffect(() => {
    const processItemsWithPromotions = async () => {
      if (!cartItems || cartItems.length === 0) {
        setProcessedCartItems([]);
        return;
      }

      const promotionCache = new Map();
      const promotionPromises = cartItems
        .filter(
          (item) =>
            item.productPromotionId &&
            !promotionCache.has(item.productPromotionId)
        )
        .map(async (item) => {
          promotionCache.set(item.productPromotionId, null);
          return apiGetPromotionId({
            accessToken,
            promotionId: item.productPromotionId,
          });
        });
      const promotionResponses = await Promise.all(promotionPromises);
      promotionResponses.forEach((response) => {
        if (response.code === 200 && response.data) {
          promotionCache.set(response.data.id, response.data);
        }
      });
      // Xử lý từng item trong giỏ hàng để tính toán giá cuối cùng
      const newProcessedItems = cartItems.map((item) => {
        const promotion = item.productPromotionId
          ? promotionCache.get(item.productPromotionId)
          : null;
        const priceInfo = calculateFinalPrice(
          item.originalPrice,
          promotion ? [promotion] : [], // calculateFinalPrice mong đợi một mảng
          item.quantity
        );

        // Trả về một object item mới với giá đã được cập nhật
        return {
          ...item,
          discountPrice: priceInfo.finalPrice, // Giá đã giảm cho 1 sản phẩm
          appliedPromotion: priceInfo.appliedPromotion, // Lưu lại KM đã áp dụng
        };
      });

      setProcessedCartItems(newProcessedItems);
    };
    processItemsWithPromotions();
  }, [cartItems, accessToken]);
  // console.log("Processed Cart Items:", cartItems);
  // Handle select all items
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.productDetailId));
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
    return processedCartItems
      .filter((item) => selectedItems.includes(item.productDetailId))
      .reduce((total, item) => total + item.discountPrice * item.quantity, 0);
  };

  // Calculate total quantity for selected items
  const calculateSelectedQuantity = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.productDetailId))
      .reduce((total, item) => total + item.quantity, 0);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showAlertInfo("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    // Lấy các item đã chọn
    const selectedCartItems = processedCartItems.filter((item) =>
      selectedItems.includes(item.productDetailId)
    );
    const totalAmount = selectedCartItems.reduce(
      (total, item) => total + item.quantity * item.discountPrice,
      0 // Giá trị khởi tạo của total là 0
    );
    // Format theo structure yêu cầu
    const formattedOrder = {
      items: selectedCartItems.map((item) => ({
        id: item.productDetailId,
        imageUrl: item.itemImage,
        productName: item.title,
        quantity: item.quantity,
        discountPrice: item.discountPrice,
        originalPrice: item.originalPrice,
        productDetailId: item.productDetailId,
      })),
      totalAmount: totalAmount,
    };
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
                cartItems={processedCartItems}
                onSelectAll={handleSelectAll}
              />

              <CartItemsList
                cartItems={processedCartItems}
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
