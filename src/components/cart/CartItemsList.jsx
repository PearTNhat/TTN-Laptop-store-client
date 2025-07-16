import React from "react";
import CartItem from "./CartItem";

const CartItemsList = ({
  cartItems,
  isOpen,
  selectedItems,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {cartItems.map((item, index) => (
        <CartItem
          key={item.id}
          item={item}
          index={index}
          isOpen={isOpen}
          isSelected={selectedItems.includes(item.id)}
          onSelectItem={onSelectItem}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
