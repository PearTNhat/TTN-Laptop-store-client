// src/pages/PurchaseOrderManagement/schema/purchaseOrder.schema.js

import { z } from "zod";

// Schema cho một chi tiết sản phẩm trong đơn hàng
const detailSchema = z.object({
    productDetailId: z.coerce.number().min(1, "Vui lòng chọn sản phẩm"),
    quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
    unitCost: z.coerce.number().min(0, "Đơn giá không được âm"),
});

// Schema chính cho việc tạo đơn hàng
export const purchaseOrderCreateSchema = z.object({
    supplierId: z.coerce.number().min(1, "Vui lòng chọn nhà cung cấp"),
    note: z.string().optional(),
    details: z.array(detailSchema).min(1, "Đơn hàng phải có ít nhất một sản phẩm."),
});