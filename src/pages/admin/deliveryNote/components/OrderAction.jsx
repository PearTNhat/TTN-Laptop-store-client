import React from "react";
import { Button } from "~/components/ui/button";
import { Trash2, Check } from "lucide-react";

const OrderActions = ({ order, onDelete, onConfirm }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(order.id, order.code);
  };

  const handleConfirmClick = (e) => {
    e.stopPropagation();
    onConfirm(order.id, order.code);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Nút xác nhận chỉ hiển thị với status DRAFT */}
      {order.status === "DRAFT" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleConfirmClick}
          className="h-8 w-8 hover:bg-green-100 text-green-600 rounded-full transition-colors"
          title="Xác nhận hoàn thành"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}

      {/* <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteClick}
        className="h-8 w-8 hover:bg-red-100 text-red-600 rounded-full transition-colors"
        title="Xóa"
      >
        <Trash2 className="h-4 w-4" />
      </Button> */}
    </div>
  );
};

export default OrderActions;
