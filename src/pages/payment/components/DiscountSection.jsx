// src/components/DiscountSection.jsx
import React, { useState, useEffect } from "react";
import { apiGetMyPromotion } from "~/apis/promotionApi";
import VoucherCard from "~/components/voucher/VoucherCard";
import { showToastError, showToastSuccess } from "~/utils/alert";

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
          // Chỉ lấy các voucher còn hạn sử dụng
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

  useEffect(() => {
    if (selectedCoupon?.code) {
      setInputCode(selectedCoupon.code);
    } else {
      setInputCode("");
    }
  }, [selectedCoupon]);

  // SỬA LẠI HOÀN TOÀN HÀM NÀY
  const applyOrRemoveVoucher = (code) => {
    if (!code) return;

    // Bỏ chọn nếu click/nhập lại code đang active
    if (selectedCoupon?.code === code) {
      showToastSuccess("Đã bỏ chọn voucher.");
      setSelectedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    const foundVoucher = vouchers.find((v) => v.id === code);

    if (!foundVoucher) {
      showToastError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }

    // Giờ đây, chúng ta làm việc trực tiếp với `foundVoucher`
    // vì nó đã có cấu trúc phẳng, không cần `promotion`.

    if (orderTotal >= foundVoucher.minOrderValue) {
      let valueDiscount =
        foundVoucher.discountType === "AMOUNT"
          ? foundVoucher.discountValue
          : (foundVoucher.discountValue * orderTotal) / 100;

      if (foundVoucher.maxValue && valueDiscount > foundVoucher.maxValue) {
        valueDiscount = foundVoucher.maxValue;
      }

      setDiscountAmount(valueDiscount);
      // Lưu lại thông tin voucher đã chọn
      // API của bạn có thể không có userPromotionId, nên ta chỉ lưu id (mã code)
      setSelectedCoupon({
        code: foundVoucher.id,
        // Nếu API có trả về một ID duy nhất khác, bạn có thể thêm vào đây
        // promotionId: foundVoucher.promotionId
      });

      // setShowVouchers(false); // Tự động đóng danh sách voucher
      showToastSuccess(`Áp dụng voucher ${foundVoucher.id} thành công!`);
    } else {
      showToastError(
        `Đơn hàng của bạn chưa đạt ${formatNumber(
          foundVoucher.minOrderValue
        )} để áp dụng voucher này.`
      );
    }
  };

  // Helper function để format số, tránh lỗi nếu orderTotal chưa có
  const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) return num;
    return new Intl.NumberFormat("vi-VN").format(num);
  };

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
        <button
          onClick={() => applyOrRemoveVoucher(inputCode)}
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
          {vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                promotion={voucher} // Truyền cả object voucher vào
                isActive={selectedCoupon?.code === voucher.id}
                handleApplyDiscount={() => applyOrRemoveVoucher(voucher.id)} // Truyền mã code
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
