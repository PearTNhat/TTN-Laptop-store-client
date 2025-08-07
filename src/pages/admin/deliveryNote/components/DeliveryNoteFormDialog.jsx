// src/pages/DeliveryNoteManagement/components/DeliveryNoteFormDialog.jsx
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { deliveryNoteSchema } from "../schema/deliveryNote.schema";
import { apiCreateDeliveryNote } from "~/apis/deliveryNoteApi";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Save, Package } from "lucide-react";
import DeliveryNoteInfoForm from "./DeliveryNoteInfoForm";
import DeliveryNoteDetailForm from "./DeliveryNoteDetailForm";
import Button from "~/components/Button";

const DeliveryNoteFormDialog = ({ isOpen, setIsOpen, onSuccess }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const methods = useForm({
    resolver: zodResolver(deliveryNoteSchema),
    defaultValues: {
      orderCode: "",
      status: "DRAFT",
      note: "",
      details: [],
    },
  });

  useEffect(() => {
    if (!isOpen) {
      methods.reset({
        orderCode: "",
        status: "DRAFT",
        note: "",
        details: [],
      });
      setSelectedOrder(null);
    }
  }, [isOpen, methods]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    // Reset details khi chọn order mới
    methods.setValue("details", []);
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting delivery note:", formData);

      const response = await apiCreateDeliveryNote({
        accessToken,
        body: formData,
      });
      if (response.code === 200) {
        showToastSuccess("Tạo phiếu giao thành công!");
        onSuccess();
        setIsOpen(false);
      } else {
        throw new Error(response.message || "Lỗi khi tạo phiếu giao");
      }
    } catch (error) {
      console.error("Submit error:", error);
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
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 text-white" />
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-semibold text-white"
                      >
                        Tạo Phiếu Giao Mới
                      </Dialog.Title>
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
                      <DeliveryNoteInfoForm onOrderSelect={handleOrderSelect} />
                      <DeliveryNoteDetailForm selectedOrder={selectedOrder} />

                      {/* Hiển thị lỗi validation */}
                      {Object.keys(methods.formState.errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h4 className="text-red-800 font-medium mb-2">
                            Lỗi validation:
                          </h4>
                          <ul className="text-red-700 text-sm space-y-1">
                            {Object.entries(methods.formState.errors).map(
                              ([key, error]) => (
                                <li key={key}>
                                  {key === "orderCode" && "Đơn hàng: "}
                                  {key === "details" && "Chi tiết: "}
                                  {error.message}
                                </li>
                              )
                            )}
                            {methods.formState.errors.details?.length > 0 &&
                              methods.formState.errors.details.map(
                                (detail, index) =>
                                  Object.entries(detail || {}).map(
                                    ([field, error]) => (
                                      <li key={`${index}-${field}`}>
                                        Dòng {index + 1} -{" "}
                                        {field === "productDetailId"
                                          ? "Sản phẩm"
                                          : field === "quantity"
                                          ? "Số lượng"
                                          : field === "serials"
                                          ? "Serial"
                                          : field}
                                        : {error?.message}
                                      </li>
                                    )
                                  )
                              )}
                          </ul>
                        </div>
                      )}

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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default DeliveryNoteFormDialog;
