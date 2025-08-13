// src/components/DiscountSection.jsx
import React, { useState, useEffect } from "react";
import { apiGetMyPromotion, apiGetPromotions } from "~/apis/promotionApi";
import VoucherCard from "~/components/voucher/VoucherCard";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { formatNumber } from "~/utils/helper";
import { calculateDiscount } from "~/utils/promotion";

const DiscountSection = ({
  orderTotal,
  selectedCoupon,
  setSelectedCoupon,
  setDiscountAmount,
  selectedShopCoupon,
  setSelectedShopCoupon,
  setShopDiscountAmount,
  accessToken,
}) => {
  const [showVouchers, setShowVouchers] = useState(false);
  const [showShopVouchers, setShowShopVouchers] = useState(false);
  const [shopVouchers, setShopVouchers] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [shopInputCode, setShopInputCode] = useState("");
  const [vouchers, setVouchers] = useState([]);
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const params = {
          page: 1,
          size: 100,
          promotionType: "SHOP_DISCOUNT",
          status: "ACTIVE",
        };

        const response = await apiGetPromotions({ accessToken, params });

        if (response.code === 200) {
          setShopVouchers(response.data.content || []);
        } else {
          setShopVouchers([]);
          showToastError(response.message || "Không thể tải khuyến mãi");
        }
      } catch (error) {
        setShopVouchers([]);
        showToastError(
          error.message || "Có lỗi xảy ra khi tải danh sách khuyến mãi"
        );
      }
    };
    loadPromotions();
  }, [accessToken]);

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

  // useEffect cho shop voucher
  useEffect(() => {
    if (selectedShopCoupon?.code) {
      setShopInputCode(selectedShopCoupon.code);
    } else {
      setShopInputCode("");
    }
  }, [selectedShopCoupon]);

  const applyOrRemoveVoucher = (code) => {
    if (!code) return;
    // Logic này vẫn giữ nguyên vì nó đã xử lý cả 2 trường hợp
    if (selectedCoupon?.code === code) {
      showToastSuccess("Đã bỏ chọn voucher.");
      setSelectedCoupon(null);
      setDiscountAmount(0);
      return;
    }
    const foundVoucher = vouchers.find((v) => v.code === code);

    if (!foundVoucher) {
      showToastError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (orderTotal >= foundVoucher.minOrderValue) {
      setDiscountAmount(calculateDiscount(orderTotal, foundVoucher));
      setSelectedCoupon({ code: foundVoucher.code, id: foundVoucher.id });
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

  const applyOrRemoveShopVoucher = (code) => {
    if (!code) return;

    if (selectedShopCoupon?.code === code) {
      showToastSuccess("Đã bỏ chọn mã giảm giá shop.");
      setSelectedShopCoupon(null);
      setShopDiscountAmount(0);
      return;
    }

    const foundVoucher = shopVouchers.find((v) => v.code === code);

    if (!foundVoucher) {
      showToastError("Mã giảm giá shop không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (orderTotal >= foundVoucher.minOrderValue) {
      setShopDiscountAmount(calculateDiscount(orderTotal, foundVoucher));
      setSelectedShopCoupon({ code: foundVoucher.code, id: foundVoucher.id });
      showToastSuccess(
        `Áp dụng mã giảm giá shop ${foundVoucher.id} thành công!`
      );
    } else {
      showToastError(
        `Đơn hàng của bạn chưa đạt ${formatNumber(
          foundVoucher.minOrderValue
        )} để áp dụng mã giảm giá shop này.`
      );
    }
  };

  // --- LOGIC MỚI ĐỂ ĐIỀU KHIỂN NÚT BẤM ---
  // Biến này sẽ là `true` khi có voucher được chọn, và mã trong input khớp với voucher đó.
  const isCodeApplied =
    selectedCoupon && selectedCoupon.code === inputCode && inputCode !== "";

  const isShopCodeApplied =
    selectedShopCoupon &&
    selectedShopCoupon.code === shopInputCode &&
    shopInputCode !== "";

  return (
    <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Mã giảm giá</h2>

      {/* Mã giảm giá User */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-gray-700">
          Mã giảm giá cá nhân
        </h3>
        <div className="flex space-x-2">
          <input
            type="text"
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            value={inputCode}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-wider"
            placeholder="NHẬP MÃ GIẢM GIÁ CÁ NHÂN"
            onKeyUp={(e) =>
              e.key === "Enter" && applyOrRemoveVoucher(inputCode)
            }
          />
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
          {showVouchers ? "Ẩn danh sách Voucher" : "Xem tất cả Voucher cá nhân"}
        </button>

        {showVouchers && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 border-t border-gray-200 pt-6">
            {vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  promotion={voucher}
                  isActive={selectedCoupon?.code === voucher.code}
                  handleApplyDiscount={() => applyOrRemoveVoucher(voucher.code)}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                Bạn không có voucher cá nhân nào khả dụng.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Mã giảm giá Shop */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-medium mb-2 text-gray-700">
          Mã giảm giá Shop
        </h3>
        <div className="flex space-x-2">
          <input
            type="text"
            onChange={(e) => setShopInputCode(e.target.value.toUpperCase())}
            value={shopInputCode}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 tracking-wider"
            placeholder="NHẬP MÃ GIẢM GIÁ SHOP"
            onKeyUp={(e) =>
              e.key === "Enter" && applyOrRemoveShopVoucher(shopInputCode)
            }
          />
          <button
            onClick={() => applyOrRemoveShopVoucher(shopInputCode)}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors flex-shrink-0 text-white ${
              isShopCodeApplied
                ? "bg-red-500 hover:bg-red-600" // Màu đỏ cho hành động "Bỏ chọn"
                : "bg-green-600 hover:bg-green-700" // Màu xanh lá cho Shop voucher
            }`}
          >
            {isShopCodeApplied ? "Bỏ chọn" : "Áp dụng"}
          </button>
        </div>
        <button
          onClick={() => setShowShopVouchers(!showShopVouchers)}
          className="mt-3 text-green-600 font-semibold hover:underline"
        >
          {showShopVouchers
            ? "Ẩn danh sách Voucher Shop"
            : "Xem tất cả Voucher Shop"}
        </button>

        {showShopVouchers && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 border-t border-gray-200 pt-6">
            {shopVouchers.length > 0 ? (
              shopVouchers.map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  promotion={voucher}
                  isActive={selectedShopCoupon?.code === voucher.code}
                  handleApplyDiscount={() =>
                    applyOrRemoveShopVoucher(voucher.code)
                  }
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                Không có voucher shop nào khả dụng.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountSection;
