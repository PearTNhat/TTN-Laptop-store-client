// src/components/DiscountSection.jsx
import React, { useState, useEffect } from "react";
import { apiGetMyPromotion } from "~/apis/promotionApi";
import VoucherCard from "~/components/voucher/VoucherCard";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { formatNumber } from "~/utils/helper";

const DiscountSection = ({
  orderTotal,
  selectedCoupon,
  setSelectedCoupon,
  setDiscountAmount,
  accessToken,
}) => {
  const [showVouchers, setShowVouchers] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const getPromotions = async () => {
      try {
        const response = await apiGetMyPromotion({ accessToken });
        if (response.code === 200) {
          const today = new Date();
          const availableVouchers = response.data.filter(
            (v) => new Date(v.endDate) >= today
          );
          setVouchers(availableVouchers);
        } else {
          throw new Error(response.message || "Failed to fetch vouchers");
        }
      } catch (error) {
        showToastError(`Lỗi khi lấy voucher: ${error.message}`);
      }
    };

    if (accessToken) {
      getPromotions();
    }
  }, [accessToken]);

  // useEffect này rất quan trọng, nó đồng bộ input với voucher được chọn
  useEffect(() => {
    if (selectedCoupon?.code) {
      setInputCode(selectedCoupon.code);
    } else {
      // Khi voucher được bỏ chọn, xóa trống input
      setInputCode("");
    }
  }, [selectedCoupon]);

  const applyOrRemoveVoucher = (code) => {
    if (!code) return;
    // Logic này vẫn giữ nguyên vì nó đã xử lý cả 2 trường hợp
    if (selectedCoupon?.code === code) {
      showToastSuccess("Đã bỏ chọn voucher.");
      setSelectedCoupon(null);
      setDiscountAmount(0);
      return;
    }
    const foundVoucher = vouchers.find((v) => v.id === Number(code));

    if (!foundVoucher) {
      showToastError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (orderTotal >= foundVoucher.minOrderValue) {
      let valueDiscount =
        foundVoucher.discountType === "AMOUNT"
          ? foundVoucher.discountValue
          : (foundVoucher.discountValue * orderTotal) / 100;

      if (foundVoucher.maxValue && valueDiscount > foundVoucher.maxValue) {
        valueDiscount = foundVoucher.maxValue;
      }
      setDiscountAmount(valueDiscount);
      setSelectedCoupon({ code: foundVoucher.id });
      // Tự động đóng danh sách voucher khi áp dụng thành công từ danh sách
      showToastSuccess(`Áp dụng voucher ${foundVoucher.id} thành công!`);
    } else {
      showToastError(
        `Đơn hàng của bạn chưa đạt ${formatNumber(
          foundVoucher.minOrderValue
        )} để áp dụng voucher này.`
      );
    }
  };

  // --- LOGIC MỚI ĐỂ ĐIỀU KHIỂN NÚT BẤM ---
  // Biến này sẽ là `true` khi có voucher được chọn, và mã trong input khớp với voucher đó.
  const isCodeApplied =
    selectedCoupon && selectedCoupon.code === inputCode && inputCode !== "";

  return (
    <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Mã giảm giá</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          value={inputCode}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-wider"
          placeholder="NHẬP MÃ GIẢM GIÁ"
          onKeyUp={(e) => e.key === "Enter" && applyOrRemoveVoucher(inputCode)}
        />
        {/* --- NÚT BẤM ĐƯỢC THAY ĐỔI Ở ĐÂY --- */}
        <button
          onClick={() => applyOrRemoveVoucher(inputCode)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors flex-shrink-0 text-white ${
            isCodeApplied
              ? "bg-red-500 hover:bg-red-600" // Màu đỏ cho hành động "Bỏ chọn"
              : "bg-blue-600 hover:bg-blue-700" // Màu xanh cho hành động "Áp dụng"
          }`}
        >
          {isCodeApplied ? "Bỏ chọn" : "Áp dụng"}
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
          {vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                promotion={voucher}
                isActive={selectedCoupon?.code === voucher.id}
                handleApplyDiscount={() => applyOrRemoveVoucher(voucher.id)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Bạn không có voucher nào khả dụng.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
