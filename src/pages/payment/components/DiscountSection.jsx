// src/components/DiscountSection.jsx
import React, { useState } from "react";
import VoucherCard from "~/components/voucher/VoucherCard";

// Dữ liệu fake
const fakeVouchers = [
  {
    userPromotionId: "USR_PROMO_1",
    promotion: {
      promotionId: 1,
      promoCode: "FREESHIP50K",
      discountType: "AMOUNT",
      discountValue: 50000,
      minOrderValue: 300000,
      maxValue: 50000,
      endDate: "2025-08-30",
    },
  },
  {
    userPromotionId: "USR_PROMO_2",
    promotion: {
      promotionId: 2,
      promoCode: "SALE20",
      discountType: "PERCENTATE",
      discountValue: 20,
      minOrderValue: 500000,
      maxValue: 150000,
      endDate: "2025-09-15",
    },
  },
  // ... các voucher khác
];

const DiscountSection = ({
  orderTotal,
  selectedCoupon,
  setSelectedCoupon,
  setDiscountAmount,
}) => {
  const [showVouchers, setShowVouchers] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const processVoucherSelection = (voucherObject) => {
    // Trường hợp 1: Bỏ chọn voucher (voucherObject là null)
    if (!voucherObject) {
      alert("Đã bỏ chọn voucher.");
      setSelectedCoupon(null);
      setDiscountAmount(0);
      // ===> XÓA TRỐNG Ô INPUT KHI BỎ CHỌN
      setInputCode("");
      return;
    }

    const { promotion, userPromotionId } = voucherObject;

    // Trường hợp 2: Áp dụng voucher mới
    if (orderTotal >= promotion.minOrderValue) {
      let valueDiscount =
        promotion.discountType === "AMOUNT"
          ? promotion.discountValue
          : (promotion.discountValue * orderTotal) / 100;

      if (promotion.maxValue && valueDiscount > promotion.maxValue) {
        valueDiscount = promotion.maxValue;
      }

      setDiscountAmount(valueDiscount);
      setSelectedCoupon({
        code: promotion.promoCode,
        promotionId: userPromotionId,
      });
      // ===> ĐƯA MÃ VOUCHER VÀO Ô INPUT KHI ÁP DỤNG THÀNH CÔNG
      setInputCode(promotion.promoCode);
      setShowVouchers(false);
      alert("Áp dụng voucher thành công!");
    } else {
      alert("Đơn hàng không đủ điều kiện để áp dụng voucher này.");
    }
  };

  const handleVoucherCardClick = (promoCode) => {
    if (selectedCoupon?.code === promoCode) {
      processVoucherSelection(null);
    } else {
      const foundVoucher = fakeVouchers.find(
        (v) => v.promotion.promoCode === promoCode
      );
      if (foundVoucher) {
        processVoucherSelection(foundVoucher);
      }
    }
  };

  const handleApplyFromInput = () => {
    if (!inputCode) return;
    const foundVoucher = fakeVouchers.find(
      (v) => v.promotion.promoCode === inputCode
    );

    if (foundVoucher) {
      // Nếu nhập mã đang active thì bỏ chọn, ngược lại thì áp dụng
      if (selectedCoupon?.code === inputCode) {
        processVoucherSelection(null);
      } else {
        processVoucherSelection(foundVoucher);
      }
    } else {
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  const today = new Date();
  const availableVouchers = fakeVouchers.filter(
    (v) => new Date(v.promotion.endDate) >= today
  );

  return (
    <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Mã giảm giá</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          // Cải tiến UX: Tự động chuyển thành chữ hoa khi gõ
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          value={inputCode}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tracking-wider"
          placeholder="NHẬP MÃ GIẢM GIÁ"
          onKeyUp={(e) => e.key === "Enter" && handleApplyFromInput()}
        />
        <button
          onClick={handleApplyFromInput}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          Áp dụng
        </button>
      </div>
      <button
        onClick={() => setShowVouchers(!showVouchers)}
        className="mt-3 text-blue-600 font-semibold hover:underline"
      >
        {showVouchers ? "Ẩn danh sách Voucher" : "Xem tất cả Voucher"}
      </button>

      {showVouchers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 border-t border-gray-200 pt-6">
          {availableVouchers.length > 0 ? (
            availableVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.userPromotionId}
                promotion={voucher.promotion}
                isActive={selectedCoupon?.code === voucher.promotion.promoCode}
                hanleApplyDiscount={handleVoucherCardClick}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Không có voucher nào khả dụng.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
