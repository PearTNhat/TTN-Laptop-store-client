import { z } from "zod";

// Validation schema
export const promotionSchema = z.object({
    name: z.string().min(1, "Tên khuyến mãi không được để trống"),
    code: z.string().min(1, "Mã khuyến mãi không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    discountValue: z.number().min(0, "Giá trị giảm phải lớn hơn 0"),
    discountUnit: z.enum(["PERCENT", "AMOUNT"]),
    promotionType: z.enum([
        "USER_PROMOTION",
        "PRODUCT_DISCOUNT",
        "GIFT",
        "SHOP_DISCOUNT",
        "ALL_USER",
        "ALL_PRODUCT",
    ]),
    minOrderValue: z
        .number()
        .min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0"),
    maxDiscountValue: z
        .number()
        .min(0, "Giá trị giảm tối đa phải lớn hơn hoặc bằng 0")
        .nullable(),
    usageLimit: z.number().min(0, "Giới hạn sử dụng phải lớn hơn hoặc bằng 0").nullable(),
    startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
    endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
    productDetailIds: z.array(z.number()).optional(),
    userIds: z.array(z.string()).optional(),
    rankLevelIds: z.array(z.number()).optional(),
}).refine(
    (data) => {
        if (data.discountUnit === "PERCENT") {
            return data.discountValue <= 100;
        }
        return true; // Nếu không phải PERCENT thì không cần kiểm tra, luôn hợp lệ
    },
    {
        message: "Giá trị giảm không được vượt quá 100%",
        path: ["discountValue"], // Gán lỗi này cho trường 'discountValue'
    }
);

