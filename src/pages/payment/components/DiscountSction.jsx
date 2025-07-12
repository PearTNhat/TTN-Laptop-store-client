import React, { useState } from "react";
import Voucher from "~/components/Vocher";
import { fakeVouchers } from "~/data/fakeOrder";

const DiscountSection = ({
  orderTotal,
  selectedCoupon,
  setSelectdCoupon,
  setDiscountAmount,
}) => {
  const [showVouchers, setShowVouchers] = useState(false);
  const [code, setCode] = useState("");

  const hanleApplyDiscount = (inputCode) => {
    if (selectedCoupon?.code === inputCode) {
      alert("Đã bỏ chọn voucher.");
      setSelectdCoupon(null);
      setCode("");
      setDiscountAmount(0);
      return;
    }
    const coupon = fakeVouchers.find(
      (v) => v.promotion.promoCode === inputCode
    );
    if (coupon) {
      const { promotion } = coupon;
      if (orderTotal >= promotion.minOrderValue) {
        setCode(inputCode);
        setSelectdCoupon({
          code: inputCode,
          promotionId: coupon.userPromotionId,
        });
        let valueDiscount =
          promotion.discountType === "VALUE"
            ? promotion.discountValue
            : (promotion.discountValue * orderTotal) / 100;
        if (valueDiscount > promotion.maxValue)
          valueDiscount = promotion.maxValue;
        setDiscountAmount(valueDiscount);
        alert("Áp dụng voucher thành công!");
      } else {
        alert("Đơn hàng không đủ điều kiện áp dụng voucher này.");
      }
    } else {
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Mã giảm giá</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          onChange={(e) => setCode(e.target.value)}
          value={code}
          className="w-full p-2 border rounded-lg"
          placeholder="Nhập mã"
        />
        <button
          onClick={() => hanleApplyDiscount(code)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Áp dụng
        </button>
      </div>
      <button
        onClick={() => setShowVouchers(!showVouchers)}
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
      >
        {showVouchers ? "Đóng" : "Chọn Voucher"}
      </button>
      {showVouchers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6 border-t pt-4">
          {fakeVouchers.map((voucher) => (
            <Voucher
              key={voucher.userPromotionId}
              promotion={voucher.promotion}
              hanleApplyDiscount={hanleApplyDiscount}
              isActive={selectedCoupon?.promotionId === voucher.userPromotionId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
