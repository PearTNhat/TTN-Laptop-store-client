// src/pages/DeliveryNoteManagement/schema/deliveryNote.schema.js

import { z } from "zod";

const detailSchema = z.object({
    productDetailId: z.coerce.number().min(1, "Vui lòng nhập ID sản phẩm"),
    quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
    serialNumbers: z.array(z.string()).optional().default([]), // Tự động tạo, không bắt buộc nhập
});

export const deliveryNoteSchema = z.object({
    orderCode: z.string().min(1, "Mã đơn hàng gốc là bắt buộc"),
    note: z.string().optional(),
    details: z.array(detailSchema).min(1, "Phiếu giao phải có ít nhất một sản phẩm."),
});