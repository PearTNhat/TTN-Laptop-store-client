// src/pages/ProductManagement/components/ProductCreateDialog.jsx
import React, { useEffect, useState } from "react";
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
} from "../../schema/product.schema";
import ProductFormStep1 from "./ProductFormStep1";
import ProductDetailFormStep2 from "./ProductDetailFormStep2";
import { Button } from "~/components/ui/button";
import ConfirmModal from "~/components/modal/ConfirmModal";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { apiCreateProduct, apiUpdateProduct } from "~/apis/productApi";
import { Loader2 } from "lucide-react";
import { mapProductToFormValues } from "../../utils/data-mapper";

const defaultValues = {
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
      id: undefined,
      images: [],
      configRequest: {
        cpu: "Intel Core i5",
        madeIn: "Việt Nam",
        displaySize: "15.6 inch",
        graphicCard: "NVIDIA GeForce GTX 1650",
        ram: "8GB DDR4",
        ramValue: "8GB",
        weight: "1.5 kg",
        hardDrive: "512GB SSD",
        hardDriveValue: "512GB",
        nameConfig: "1080p Gaming",
      },
    },
  ],
};
const ProductCreateDialog = ({
  accessToken,
  isOpen,
  setIsOpen,
  onSuccess,
  onUpdate,
  brands,
  categories,
  colorsOptions,
  editingProduct,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!editingProduct;
  const title = isEditMode ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới";
  const formMethods = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: isEditMode ? {} : defaultValues,
  });
  const handleNextStep = async () => {
    const isValid = await formMethods.trigger(
      Object.keys(productStep1Schema.shape)
    );

    // DEBUG: In ra lỗi validation trong console
    if (Object.keys(formMethods.formState.errors).length > 0) {
      console.log("🚨 Validation Errors:", formMethods.formState.errors);
    }

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
    // DEBUG: In ra lỗi validation trước khi submit
    if (Object.keys(formMethods.formState.errors).length > 0) {
      console.log(
        "🚨 Validation Errors before submit:",
        formMethods.formState.errors
      );
      showToastError(
        "Vui lòng kiểm tra lại thông tin, có lỗi validation chưa được xử lý!"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const res = await apiUpdateProduct({
          accessToken,
          body: data,
          id: editingProduct.id,
        });
        if (res.code === 200) {
          showToastSuccess("Cập nhật sản phẩm thành công");
          onUpdate(data); // Gọi callback để tải lại danh sách
        } else {
          if (res?.message.includes("slug")) {
            showToastError("Slug đã tồn tại, vui lòng chọn slug khác.");
          } else {
            showToastError(res.message || "Lỗi khi cập nhật phẩm");
          }
          return;
        }
        onUpdate({ ...data, config: data.configRequest }); // Gọi callback để cập nhật sản phẩm
      } else {
        // await apiCreateProduct(data);
        const res = await apiCreateProduct({ accessToken, body: data });
        if (res.code === 200) {
          showToastSuccess("Tạo sản phẩm thành công");
          onSuccess(res.data); // Gọi callback để tải lại danh sách
        } else {
          if (res?.message.includes("slug")) {
            showToastError("Slug đã tồn tại, vui lòng chọn slug khác.");
          } else {
            showToastError(res.message || "Lỗi khi tạo sản phẩm");
          }
        }
      }
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
  useEffect(() => {
    if (isEditMode && isOpen) {
      const formValues = mapProductToFormValues(editingProduct);
      formMethods.reset(formValues);
    } else if (!isOpen) {
      formMethods.reset(defaultValues);
      setStep(1);
    }
  }, [isEditMode, editingProduct, isOpen, formMethods]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1
              ? `${title} - Thông tin chung`
              : `${title} - Chi tiết phiên bản`}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin cho sản phẩm."
              : "Điền thông tin để tạo sản phẩm mới."}
          </DialogDescription>
        </DialogHeader>

        {/* FormProvider để các component con có thể truy cập form context */}
        <FormProvider {...formMethods}>
          {/* Dùng overflow-y-auto để chỉ cuộn phần nội dung, giữ header và footer cố định */}
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            {step === 1 && (
              <ProductFormStep1 brands={brands} categories={categories} />
            )}
            {step === 2 && (
              <ProductDetailFormStep2 colorsOptions={colorsOptions} />
            )}
          </div>

          <DialogFooter className="pt-4 border-t">
            {/* DEBUG BUTTON - Xóa sau khi debug xong */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                await formMethods.trigger();
                console.log(
                  "🔍 Debug - All validation errors:",
                  formMethods.formState.errors
                );
                console.log("🔍 Debug - Form values:", formMethods.getValues());
              }}
              className="mr-2"
            >
              🔍
            </Button>
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
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400"
                type="button"
                onClick={handleNextStep}
              >
                Tiếp tục
              </Button>
            ) : (
              // **SỬA LỖI & LÀM ĐẸP BUTTON**
              <Button
                type="button"
                onClick={formMethods.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Hoàn tất và Tạo sản phẩm"
                )}
              </Button>
            )}
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateDialog;
