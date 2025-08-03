import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { receiptNoteSchema } from "../schema/goodsReceipt.schema";
import { apiCreateGoodsReceiptNote } from "~/apis/goodsReceipt";
import { showToastError, showToastSuccess } from "~/utils/alert";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Package, Save, X } from "lucide-react";
import Button from "~/components/Button";
import GoodReceiptInfoForm from "./GoodReceiptInfoForm";
import GoodReceiptDetailForm from "./GoodReceiptDetailForm";
import { format } from "date-fns";
function GoodReceiptFromDialog({ isOpen, setIsOpen, onSuccess }) {
  const { accessToken } = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm({
    resolver: zodResolver(receiptNoteSchema),
    defaultValues: {
      purchaseOrderCode: "",
      note: "",
      receivedDate: format(new Date(), "yyyy-MM-dd"),
      detailRequestList: [
        {
          productDetailId: "",
          quantity: 1,
          unitPrice: 0,
          purchaseOrderDetailId: "",
          serialNumber: [],
        },
      ],
    },
  });
  useEffect(() => {
    if (isOpen) {
      methods.reset({
        purchaseOrderCode: "",
        note: "",
        receivedDate: format(new Date(), "yyyy-MM-dd"),
        detailRequestList: [
          {
            productDetailId: "",
            quantity: 1,
            unitPrice: 0,
            purchaseOrderDetailId: "",
            serialNumber: [],
          },
        ],
      });
    }
  }, [isOpen, methods]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    console.log("formData", formData);
    try {
      const response = await apiCreateGoodsReceiptNote({
        accessToken,
        body: formData,
      });
      if (response.code === 201 || response.code === 200) {
        showToastSuccess("Tạo phiếu giao thành công!");
        onSuccess();
        setIsOpen(false);
      } else {
        throw new Error(response.message || "Lỗi khi tạo phiếu giao");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      methods.reset();
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 text-white" />
                      <DialogTitle
                        as="h3"
                        className="text-xl font-semibold text-white"
                      >
                        Tạo Phiếu Xuất Mới
                      </DialogTitle>
                    </div>
                    <button
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-[80vh] overflow-y-auto">
                  <FormProvider {...methods}>
                    <form
                      onSubmit={methods.handleSubmit(onSubmit)}
                      className="p-6 space-y-6"
                    >
                      <GoodReceiptInfoForm />
                      <GoodReceiptDetailForm />

                      {/* Actions */}
                      <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button
                          type="button"
                          onClick={handleClose}
                          disabled={isSubmitting}
                          className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang tạo...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Tạo phiếu
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default GoodReceiptFromDialog;
