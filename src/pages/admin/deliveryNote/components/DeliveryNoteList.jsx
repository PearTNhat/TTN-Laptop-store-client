// src/pages/DeliveryNoteManagement/components/DeliveryNoteList.jsx

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Hash, Calendar, User, Package, FileText, Loader2 } from "lucide-react";
import DeliveryNoteDetail from "./DeliveryNoteDetail";
import OrderActions from "./OrderAction"; // Tái sử dụng component actions

// Map trạng thái từ API sang text và màu sắc để hiển thị
const STATUS_STYLES = {
  DRAFT: { text: "Bản nháp", color: "text-gray-600 bg-gray-100" },
  COMPLETED: { text: "Hoàn thành", color: "text-green-600 bg-green-100" },
  CANCELLED: { text: "Đã hủy", color: "text-red-600 bg-red-100" },
};

const DeliveryNoteList = ({
  deliveryNotes,
  onFetchDetails,
  onEdit,
  onDelete,
}) => {
  // Hàm này được gọi mỗi khi người dùng mở hoặc đóng một AccordionItem
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
          Danh sách phiếu giao hàng
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
            {deliveryNotes.length}
          </span>
        </h2>
      </div>

      <div className="p-6">
        <Accordion
          type="multiple"
          className="w-full space-y-4"
          onValueChange={handleAccordionChange}
        >
          {deliveryNotes.map((note) => {
            const statusStyle = STATUS_STYLES[note.status] || {
              text: note.status,
              color: "text-gray-600 bg-gray-100",
            };

            return (
              <AccordionItem
                value={note.id.toString()}
                key={note.id}
                className="border-0 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center w-full px-6 py-5 rounded-xl">
                  <AccordionTrigger className="flex-1 p-0 hover:no-underline bg-transparent text-left">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                      {/* Mã Phiếu Giao */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Hash className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Mã Phiếu Giao
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {note.code}
                          </p>
                        </div>
                      </div>

                      {/* Ngày Giao */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Ngày Giao
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {new Date(note.date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>

                      {/* Nhân viên */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Nhân viên
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {note.staffName}
                          </p>
                        </div>
                      </div>

                      {/* Trạng thái */}
                      <div className="flex items-center justify-start lg:justify-center">
                        <span
                          className={`px-4 py-2 text-xs font-semibold rounded-full border ${statusStyle.color}`}
                        >
                          {statusStyle.text}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* Actions */}
                  <div className="ml-6 flex-shrink-0">
                    <OrderActions
                      order={note}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </div>

                <AccordionContent className="px-6 pb-6 pt-0">
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
                    ) : note.deliveryNoteDetails ? (
                      <DeliveryNoteDetail details={note.deliveryNoteDetails} />
                    ) : (
                      <div className="h-4"></div>
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
};

export default DeliveryNoteList;
