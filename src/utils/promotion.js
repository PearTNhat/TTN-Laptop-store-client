export const calculateFinalPrice = (originalPrice, promotions = [], quantity = 1) => {
    if (promotions.length === 0) {
        return {
            finalPrice: originalPrice,
            discountAmount: 0,
            appliedPromotion: null,
        };
    }

    let bestDiscount = 0;
    let appliedPromotion = null;

    // Lọc và tìm khuyến mãi tốt nhất
    for (const promo of promotions) {
        // BỎ QUA KHUYẾN MÃI NẾU VI PHẠM USAGELIMIT
        // Kiểm tra xem số lượng mua có vượt quá số lượt còn lại của khuyến mãi không
        if (promo.usageLimit) {
            const remainingUses = promo.usageLimit;
            if (quantity > remainingUses) {
                continue; // Bỏ qua khuyến mãi này vì không đủ lượt
            }
        }

        // BỎ QUA NẾU KHÔNG ĐẠT GIÁ TRỊ ĐƠN HÀNG TỐI THIỂU
        // (Lưu ý: Logic này áp dụng cho tổng giỏ hàng, ở đây ta tạm tính trên 1 item)
        if (promo.minOrderValue !== 0 && promo.minOrderValue > originalPrice * quantity) {
            console.log("out", promo.name)
            continue;
        }

        let currentDiscount = 0;
        if (promo.discountUnit === 'PERCENT') {
            currentDiscount = (originalPrice * promo.discountValue) / 100;
            if (promo.maxDiscountValue && currentDiscount > promo.maxDiscountValue) {
                currentDiscount = promo.maxDiscountValue;
            }
        } else if (promo.discountUnit === 'AMOUNT' || promo.discountUnit === 'VALUE') {
            currentDiscount = promo.discountValue;
        }

        if (currentDiscount > bestDiscount) {
            bestDiscount = currentDiscount;
            appliedPromotion = promo;
        }
    }

    const finalPrice = Math.max(0, originalPrice - bestDiscount);
    return {
        finalPrice,
        discountAmount: bestDiscount > originalPrice ? originalPrice : bestDiscount,
        appliedPromotion,
    };
};

export function calculateDiscount(orderTotal, voucher) {
    // Bước 1: Kiểm tra các điều kiện đầu vào cơ bản
    if (!voucher || typeof orderTotal !== 'number' || orderTotal < 0) {
        return 0;
    }

    // Bước 2: Kiểm tra điều kiện giá trị đơn hàng tối thiểu
    if (orderTotal < voucher.minOrderValue) {
        console.log("Đơn hàng không đủ điều kiện tối thiểu.");
        return 0;
    }

    let calculatedDiscount = 0;

    // Bước 3: Tính toán số tiền giảm giá thô dựa trên loại voucher
    if (voucher.discountUnit === 'PERCENT') {
        calculatedDiscount = (orderTotal * voucher.discountValue) / 100;
    } else if (voucher.discountUnit === 'AMOUNT' || voucher.discountUnit === 'VALUE') {
        calculatedDiscount = voucher.discountValue;
    } else {
        return 0;
    }

    // Bước 4: Áp dụng giới hạn giảm giá tối đa (nếu có)
    // Kiểm tra xem maxDiscountValue có tồn tại và lớn hơn 0 không
    if (voucher.maxDiscountValue && voucher.maxDiscountValue > 0) {
        // Lấy giá trị nhỏ hơn giữa số tiền đã tính và mức giảm tối đa
        calculatedDiscount = Math.min(calculatedDiscount, voucher.maxDiscountValue);
    }

    // Bước 5 (Quan trọng): Đảm bảo số tiền giảm không vượt quá tổng giá trị đơn hàng
    calculatedDiscount = Math.min(calculatedDiscount, orderTotal);

    return calculatedDiscount;
}