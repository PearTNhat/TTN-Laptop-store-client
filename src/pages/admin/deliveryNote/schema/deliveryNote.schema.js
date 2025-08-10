// src/pages/DeliveryNoteManagement/schema/deliveryNote.schema.js

import { z } from "zod";

const detailSchema = z.object({
    productDetailId: z.coerce.number().min(1, "Vui lòng chọn sản phẩm"),
    quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
    serialProductItemId: z.array(z.string()).min(1, "Vui lòng chọn serial number"),
});

export const deliveryNoteSchema = z.object({
    orderCode: z.string().min(1, "Vui lòng chọn đơn hàng"),
    status: z.enum(["DRAFT", "COMPLETED"]).default("DRAFT"),
    note: z.string().optional(),
    details: z.array(detailSchema).min(1, "Phiếu xuất phải có ít nhất một sản phẩm."),
});