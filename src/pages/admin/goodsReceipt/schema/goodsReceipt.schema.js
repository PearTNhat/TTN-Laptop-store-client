// src/pages/PurchaseOrderManagement/schema/purchaseReceipt.schema.js

import { z } from "zod";

// Schema cho một chi tiết sản phẩm trong phiếu NHẬN HÀNG
const receiptNoteDetailSchema = z.object({
    productDetailId: z.coerce.number().min(1, "Vui lòng chọn sản phẩm"),
    purchaseOrderDetailId: z.coerce.number().min(1, "Thiếu ID của chi tiết đơn hàng gốc"),
    quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
    serialNumber: z.array(z.string().min(1, "Số sê-ri không được để trống"))
        .min(1, "Vui lòng nhập ít nhất một số sê-ri"),
    unitPrice: z.coerce.number().min(0, "Đơn giá không được âm"),
})
    .refine(data => data.serialNumber.length === data.quantity, {
        // Ràng buộc nâng cao: Số lượng sê-ri phải bằng số lượng sản phẩm
        message: "Số lượng sê-ri phải bằng số lượng sản phẩm đã nhận",
        path: ["serialNumber"], // Hiển thị lỗi ở trường serialNumber
    });


// Schema chính cho việc tạo phiếu NHẬN HÀNG
export const receiptNoteSchema = z.object({
    note: z.string().optional(),
    purchaseOrderCode: z.string().min(1, "Mã đơn hàng không được để trống"),
    receivedDate: z.coerce.date({
        required_error: "Vui lòng chọn ngày nhận hàng.",
        invalid_type_error: "Ngày nhận hàng không hợp lệ.",
    }),
    detailRequestList: z.array(receiptNoteDetailSchema)
        .min(1, "Phiếu nhận hàng phải có ít nhất một sản phẩm."),
});
