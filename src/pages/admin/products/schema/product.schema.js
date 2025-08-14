// src/pages/ProductManagement/product.schema.js

import { z } from "zod";

// --- Schema cho config và product detail giữ nguyên, chúng đã tốt rồi ---
const configSchema = z.object({
    cpu: z.string().min(1, "CPU là bắt buộc"),
    ram: z.string().min(1, "RAM là bắt buộc"),
    hardDrive: z.string().min(1, "Ổ cứng là bắt buộc"),
    graphicCard: z.string().min(1, "Card đồ họa là bắt buộc"),
    displaySize: z.string().min(1, "Kích thước màn hình là bắt buộc"),
    ramValue: z.string().optional(),
    hardDriveValue: z.string().optional(),
    weight: z.string().optional(),
    madeIn: z.string().optional(),
    nameConfig: z.string().optional(),
});

const productDetailSchema = z.object({
    id: z.number().optional().nullable(),
    title: z.string().min(1, "Tên phiên bản là bắt buộc"),
    // THÊM LẠI SLUG
    slug: z.string().min(1, "Slug là bắt buộc"),
    colorId: z.union([z.number().positive(), z.undefined()]).refine(val => val !== undefined, { message: "Vui lòng chọn màu" }),
    originalPrice: z.coerce.number().min(1, "Giá gốc phải lớn hơn 0"),
    // Yêu cầu có ít nhất 1 ảnh và tối đa 5 ảnh
    thumbnail: z.string().url(),
    images: z.array(z.string().url()).min(1, "Vui lòng tải lên ít nhất một ảnh").max(5, "Chỉ được phép tải lên tối đa 5 ảnh"),
    warrantyProd: z.string().optional(),
    configRequest: configSchema,
});

// --- Cập nhật chính ở đây ---
export const productCreateSchema = z.object({
    description: z.string().min(1, "Mô tả sản phẩm là bắt buộc"),

    // SỬA LỖI: Chấp nhận `number` hoặc `undefined` ban đầu, sau đó refine
    brandId: z.union([z.number().positive(), z.undefined()])
        .refine(val => val !== undefined, { message: "Vui lòng chọn thương hiệu" }),

    categoryId: z.union([z.number().positive(), z.undefined()])
        .refine(val => val !== undefined, { message: "Vui lòng chọn danh mục" }),

    // Cho phép seriesId là optional vì nó phụ thuộc vào brandId
    seriesId: z.union([z.number().positive(), z.undefined()])
        .optional(),

    productDetailRequest: z.array(productDetailSchema),
})



// Schema cho bước 1, nó sẽ thừa hưởng các quy tắc mới
export const productStep1Schema = productCreateSchema.pick({
    description: true,
    brandId: true,
    categoryId: true,
    seriesId: true,
});