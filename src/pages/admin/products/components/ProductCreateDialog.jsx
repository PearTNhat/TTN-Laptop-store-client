// src/pages/ProductManagement/components/ProductCreateDialog.jsx

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  productCreateSchema,
  productStep1Schema,
} from "../schema/product.schema";
import ProductFormStep1 from "./create/ProductFormStep1";
import ProductDetailFormStep2 from "./create/ProductDetailFormStep2";
import { Button } from "~/components/ui/button";
import ConfirmModal from "~/components/modal/ConfirmModal";
import { showToastError } from "~/utils/alert";
// import { apiCreateProduct } from '~/apis/productApi'; // Giả sử có API này

// Component này sẽ nhận state đóng/mở và dữ liệu từ cha
const ProductCreateDialog = ({
  isOpen,
  setIsOpen,
  onSuccess,
  brands,
  categories,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      description: "",
      brandId: undefined,
      categoryId: undefined,
      seriesId: undefined,
      productDetailRequest: [
        {
          title: "",
          colorId: undefined,
          originalPrice: 0,
          slug: "",
          thumbnail: "",
          images: [""],
          configRequest: {
            cpu: "",
            ram: "",
            hardDrive: "",
            graphicCard: "",
            displaySize: "",
          },
        },
      ],
    },
  });

  const handleNextStep = async () => {
    const isValid = await formMethods.trigger(
      Object.keys(productStep1Schema.shape)
    );
    if (isValid) {
      setStep(2);
    } else {
      showToastError(
        "Vui lòng điền đầy đủ thông tin ở bước này trước khi tiếp tục."
      );
    }
  };

  const handleBackStep = () => setStep(1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting data:", data);
      // await apiCreateProduct(data);
      ConfirmModal.toast({
        icon: "success",
        title: "Tạo sản phẩm thành công!",
      });
      onSuccess(); // Gọi callback để tải lại danh sách
      setIsOpen(false); // Đóng modal
    } catch (error) {
      ConfirmModal.toast({
        icon: "error",
        title: error.message || "Tạo sản phẩm thất bại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm để reset form và quay về bước 1 khi modal được đóng
  const handleOnOpenChange = (open) => {
    if (!open) {
      formMethods.reset();
      setStep(1);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1
              ? "Tạo sản phẩm mới - Thông tin chung"
              : "Tạo sản phẩm mới - Chi tiết phiên bản"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Điền các thông tin cơ bản để phân loại sản phẩm."
              : "Thêm ít nhất một phiên bản chi tiết cho sản phẩm."}
          </DialogDescription>
        </DialogHeader>

        {/* FormProvider để các component con có thể truy cập form context */}
        <FormProvider {...formMethods}>
          {/* Dùng overflow-y-auto để chỉ cuộn phần nội dung, giữ header và footer cố định */}
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            {step === 1 && (
              <ProductFormStep1 brands={brands} categories={categories} />
            )}
            {step === 2 && <ProductDetailFormStep2 />}
          </div>

          <DialogFooter className="pt-4 border-t">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBackStep}
                disabled={isSubmitting}
              >
                Quay lại
              </Button>
            )}
            <div className="flex-grow"></div> {/* Spacer */}
            {step === 1 ? (
              <Button type="button" onClick={handleNextStep}>
                Tiếp tục
              </Button>
            ) : (
              <Button
                type="button"
                onClick={formMethods.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất và Tạo sản phẩm"}
              </Button>
            )}
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateDialog;
