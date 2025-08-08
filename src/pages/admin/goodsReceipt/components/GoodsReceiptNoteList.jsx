import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Calendar, FileText, Hash, Loader2, Package, User } from "lucide-react";
import React from "react";
import OrderActions from "./OrderAction";
import DeliveryNoteDetail from "../../deliveryNote/components/DeliveryNoteDetail";

function GoodsReceiptNoteList({ goodsReceiptNotes, onFetchDetails, onDelete }) {
  const handleAccordionChange = (openItemValues) => {
    // Lấy ID của item cuối cùng được mở để fetch details
    const lastOpenedId = openItemValues[openItemValues.length - 1];
    if (lastOpenedId) {
      onFetchDetails(parseInt(lastOpenedId, 10));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5 text-green-600" />
          Danh sách phiếu nhập{" "}
          {/* CHANGE 1: Cải thiện hiển thị badge số lượng */}
          <span className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
            {goodsReceiptNotes.length}
          </span>
        </h2>
      </div>

      <div className="p-4 md:p-6">
        <Accordion
          type="multiple"
          className="w-full space-y-4"
          onValueChange={handleAccordionChange}
        >
          {goodsReceiptNotes.map((note) => {
            return (
              <AccordionItem
                value={note.id.toString()}
                key={note.id}
                className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="flex items-center w-full px-6 py-5 bg-white">
                  <AccordionTrigger className="flex-1 p-0 hover:no-underline text-left">
                    {/* CHANGE 2: Thay đổi grid thành 5 cột trên màn hình lớn */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-4 gap-x-6 items-center">
                      {/* Mã Phiếu Nhập */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Hash className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Mã Phiếu Nhập
                          </p>
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {note.code}
                          </p>
                        </div>
                      </div>
                      {/* Ngày Nhập */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Ngày Nhập
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {new Date(note.receivedDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      {/* Nhân viên */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Nhân viên
                          </p>
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {note.staffName}
                          </p>
                        </div>
                      </div>
                      {/* Mã Đơn Mua */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Mã Đơn Mua
                          </p>
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {note.purchaseOrderCode || "N/A"}
                          </p>
                        </div>
                      </div>
                      {/* Tổng số lượng */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Tổng số lượng
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {note.totalQuantity ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <div className="ml-6 flex-shrink-0">
                    <OrderActions order={note} onDelete={onDelete} />
                  </div>
                </div>
                <AccordionContent className="px-6 pb-6 pt-0 bg-white">
                  <div className="border-t border-gray-200 pt-6">
                    {note.note && (
                      <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-amber-800 mb-1">
                              Ghi chú:
                            </p>
                            <p className="text-sm text-amber-700">
                              {note.note}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Loading or Details */}
                    {note.isLoadingDetails ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        <span className="ml-3 text-gray-600 font-medium">
                          Đang tải chi tiết...
                        </span>
                      </div>
                    ) : note.grnDetails ? (
                      <DeliveryNoteDetail details={note.grnDetails} />
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500">
                        Chưa có dữ liệu chi tiết.
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

export default GoodsReceiptNoteList;
