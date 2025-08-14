import React from "react";
import { Button } from "~/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const OrderActions = ({ order, onEdit, onDelete }) => {
  const handleEditClick = async (e) => {
    e.stopPropagation(); // Ngăn Accordion mở/đóng khi bấm nút
    onEdit(order);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(order.id, order.code);
  };

  return (
    <div className="flex items-center gap-2 ml-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEditClick}
        className="h-8 w-8 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
        title="Chỉnh sửa"
      >
        <Pencil className="h-4 w-4" />
      </Button>
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
