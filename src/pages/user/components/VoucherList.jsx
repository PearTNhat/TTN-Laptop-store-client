// src/components/VoucherList.jsx
import React, { useState } from "react";
// Đảm bảo đường dẫn import chính xác
import VoucherCard from "~/components/voucher/VoucherCard";

// FAKE DATA - Đã chuyển đổi để phù hợp với prop 'promotion' của VoucherCard
const initialPromotions = [
  {
    promotionId: 1,
    promoCode: "FREESHIP50K",
    discountType: "AMOUNT", // Giảm theo số tiền
    discountValue: 50000,
    minOrderValue: 300000,
    endDate: "2025-08-30",
  },
  {
    promotionId: 2,
    promoCode: "SALE20",
    discountType: "PERCENTATE", // Giảm theo phần trăm
    discountValue: 20,
    minOrderValue: 500000,
    endDate: "2025-09-15",
  },
  {
    promotionId: 3,
    promoCode: "WELCOME100",
    discountType: "AMOUNT",
    discountValue: 100000,
    minOrderValue: 600000,
    endDate: "2025-12-25",
  },
  {
    promotionId: 4,
    promoCode: "HETHAN",
    discountType: "AMOUNT",
    discountValue: 99000,
    minOrderValue: 100000,
    endDate: "2023-01-01", // Voucher đã hết hạn để test
  },
];

const VoucherList = ({ onVoucherSelect = () => {} }) => {
  // State quản lý mã voucher nào đang được chọn (active)
  const [activePromoCode, setActivePromoCode] = useState(null);

  // Lọc ra các voucher còn hạn sử dụng
  const today = new Date();
  const availableVouchers = initialPromotions.filter(
    (p) => new Date(p.endDate) >= today
  );

  // Hàm xử lý khi nhấn nút "Áp dụng" hoặc "Bỏ chọn"
  const handleApplyDiscount = (promoCode) => {
    let selectedVoucher = null;

    // Nếu nhấn vào voucher đang active -> Bỏ chọn (set về null)
    if (activePromoCode === promoCode) {
      setActivePromoCode(null);
    }
    // Ngược lại, chọn voucher mới
    else {
      setActivePromoCode(promoCode);
      selectedVoucher = initialPromotions.find(
        (p) => p.promoCode === promoCode
      );
    }

    // Gọi callback function để component cha nhận được voucher đã chọn (hoặc null)
    onVoucherSelect(selectedVoucher);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-50 rounded-xl p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Chọn voucher ưu đãi
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Áp dụng mã để nhận được giảm giá tốt nhất cho đơn hàng của bạn.
      </p>

      {availableVouchers.length > 0 ? (
        <div>
          {availableVouchers.map((promotion) => (
            <VoucherCard
              key={promotion.promotionId}
              promotion={promotion}
              //   isActive={activePromoCode === promotion.promoCode}
              //   hanleApplyDiscount={handleApplyDiscount}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow-sm">
          <p className="text-lg font-medium">Không có voucher nào khả dụng.</p>
          <p className="text-sm mt-1">Vui lòng quay lại sau nhé!</p>
        </div>
      )}
    </div>
  );
};

export default VoucherList;
