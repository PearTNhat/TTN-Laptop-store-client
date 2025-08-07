import React from "react";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";

const OrderActions = ({ order, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(order.id, order.code);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteClick}
        className="h-8 w-8 hover:bg-red-100 text-red-600 rounded-full transition-colors"
        title="Xóa"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderActions;
