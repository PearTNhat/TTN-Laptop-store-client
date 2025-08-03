// src/pages/PurchaseOrderManagement/components/PurchaseOrderFormDialog.jsx
// (File này là phiên bản nâng cấp của PurchaseOrderCreateDialog.jsx)

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";

import { purchaseOrderCreateSchema } from "../schema/purchaseOrder.schema";
import {
  apiCreatePurchaseOrder,
  apiUpdatePurchaseOrder,
} from "~/apis/purchaseOrderApi";
import { showToastError } from "~/utils/alert";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Loader2 } from "lucide-react";
import PurchaseOrderInfoForm from "./PurchaseOrderInfoForm";
import PurchaseOrderDetailForm from "./PurchaseOrderDetailForm";

// Dữ liệu mock (nên được truyền từ component cha trong thực tế)
const mockSuppliers = [
  { id: 1, name: "Apple Official Store" },
  { id: 2, name: "Dell Vietnam Distributor" },
  { id: 3, name: "Logitech Authorized Dealer" },
];

const defaultValues = {
  supplierId: undefined,
  note: "",
  details: [
    {
      productDetailId: undefined,
      quantity: 1,
      unitCost: 0,
    },
  ],
};

// Component đa năng cho cả Create và Edit
const PurchaseOrderFormDialog = ({
  isOpen,
  setIsOpen,
  editingOrder,
  onCreateSuccess,
  onUpdateSuccess,
}) => {
  const { accessToken } = useSelector((state) => state.user);
  const isEditMode = !!editingOrder;
  const dialogTitle = isEditMode
    ? `Chỉnh sửa Đơn hàng: ${editingOrder.code}`
    : "Tạo Đơn Nhập Hàng Mới";
  const submitButtonText = isEditMode ? "Lưu Thay Đổi" : "Tạo Đơn Hàng";

  const methods = useForm({
    resolver: zodResolver(purchaseOrderCreateSchema),
    defaultValues: isEditMode ? editingOrder : defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  // --- 2. Điền dữ liệu vào form khi ở chế độ Edit ---
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editingOrder) {
        reset({
          supplierId: editingOrder.supplierId,
          note: editingOrder.note || "",
          details: editingOrder.details || [],
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, isEditMode, editingOrder, reset]);

  // --- 3. Logic Submit đa năng ---
  const onSubmit = async (formData) => {
    try {
      console.log("Submitting form data:", formData);
      if (isEditMode) {
        console.log("Updating order with data:", formData);
        const response = await apiUpdatePurchaseOrder({
          accessToken,
          id: editingOrder.id,
          data: formData,
        });
        if (response.code !== 200) throw new Error(response.message);
        onUpdateSuccess(response.data); // Gọi callback cho cha
      } else {
        // Chế độ CREATE: Gọi API Create
        console.log("Submitting form data:", formData);
        const response = await apiCreatePurchaseOrder({
          accessToken,
          body: formData,
        });
        if (response.code !== 200) throw new Error(response.message);
        onCreateSuccess(response.data); // Gọi callback cho cha
      }
      setIsOpen(false);
    } catch (error) {
      showToastError(error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-6 custom-scrollbar"
          >
            <PurchaseOrderInfoForm suppliers={mockSuppliers} />
            <PurchaseOrderDetailForm />
          </form>
        </FormProvider>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderFormDialog;
