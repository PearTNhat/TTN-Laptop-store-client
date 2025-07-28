import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiGetMyVouchers } from "~/apis/userApi";
import { useSelector } from "react-redux";
import { apiGetMyPromotion } from "~/apis/promotionApi";
// Component hiển thị một voucher
const VoucherCard = ({ voucher, isActive, onApply, onCopy, copiedCode }) => {
  const today = new Date();
  const endDate = new Date(voucher.endDate);
  const isExpired = endDate < today;
  const isExpiringSoon =
    !isExpired && (endDate - today) / (1000 * 60 * 60 * 24) <= 7;

  if (isExpired) return null;

  const formatDiscount = () => {
    return voucher.discountUnit === "AMOUNT"
      ? `${voucher.discountValue.toLocaleString()}đ`
      : `${voucher.discountValue}%`;
  };

  const formatMinOrder = () => {
    return voucher.minOrderValue === 0
      ? "toàn shop"
      : `đơn từ ${voucher.minOrderValue.toLocaleString()}đ`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl shadow-md p-6 mb-6 transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-br from-yellow-50 via-yellow-200 to-amber-100 ring-4 ring-yellow-400 shadow-xl scale-[1.02]"
          : "bg-gradient-to-br from-blue-100 via-pink-200 to-rose-100 ring-1 ring-gray-200"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-pink-100/20 to-blue-100/30 pointer-events-none rounded-xl blur-sm"></div>
      {isExpiringSoon && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-100 text-yellow-800 px-3 py-1 text-xs rounded-full shadow font-semibold flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Sắp hết hạn
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Badge giảm giá */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0 w-[110px] min-h-[90px] px-2 py-3 rounded-xl bg-gradient-to-br from-indigo-600 via-pink-500 to-rose-400 ring-2 ring-rose-200 flex flex-col items-center justify-center text-white shadow-md"
        >
          <span className="text-base font-bold text-center break-words leading-tight">
            {formatDiscount()}
          </span>
          <span className="text-xs mt-1 tracking-wide uppercase opacity-80">
            Giảm giá
          </span>
        </motion.div>

        {/* Thông tin voucher */}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-bold text-blue-800 truncate">
            {voucher.name}
          </h3>
          <p className="text-gray-700 mt-1">
            Giảm {formatDiscount()} cho {formatMinOrder()}
          </p>
          {voucher.maxDiscountValue && (
            <p className="text-sm text-gray-500">
              (Tối đa {voucher.maxDiscountValue.toLocaleString()}đ)
            </p>
          )}
          {voucher.description && (
            <p className="text-sm italic text-gray-500 mt-1">
              {voucher.description}
            </p>
          )}

          <div className="flex gap-4 text-xs text-gray-600 mt-3">
            <span>📅 HSD: {endDate.toLocaleDateString("vi-VN")}</span>
            <span>
              🔐 Mã: <span className="font-mono">{voucher.name}</span>
            </span>
          </div>
        </div>

        {/* Các nút tương tác */}
        <div className="flex flex-col gap-2 w-full md:w-40 mt-4 md:mt-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onCopy(voucher.name)}
            className={`px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition ${
              copiedCode === voucher.name
                ? "bg-green-100 text-green-700 ring-2 ring-green-300"
                : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:from-indigo-700 hover:to-blue-700"
            }`}
          >
            {copiedCode === voucher.name ? "✅ Đã sao chép" : "📋 Sao chép mã"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApply(voucher)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isActive
                ? "bg-green-500 text-white hover:bg-green-600 shadow-lg ring-2 ring-green-300"
                : "bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-600 text-white hover:brightness-110"
            }`}
          >
            {isActive ? "Đã áp dụng ✓" : "Áp dụng ngay"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Component danh sách voucher
const VoucherList = ({ onVoucherSelect = () => {} }) => {
  const [activeCode, setActiveCode] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPromotions = async () => {
      setIsLoading(true);
      try {
        const res = await apiGetMyPromotion({ accessToken });
        if (res.code === 200) {
          const valid = res.data.filter(
            (v) => new Date(v.endDate) > new Date()
          );
          setPromotions(valid);
        } else {
          console.error("Lỗi lấy voucher:", res.message);
          setPromotions([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải promotions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleApply = (voucher) => {
    setActiveCode((prev) => (prev === voucher.name ? null : voucher.name));
    onVoucherSelect(voucher);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const validVouchers = promotions.filter(
    (v) => new Date(v.endDate) > new Date()
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2">
          🎁 Ưu đãi dành riêng cho bạn
        </h2>
        <p className="text-gray-600">
          Chọn voucher phù hợp để tiết kiệm nhiều hơn
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-b-4 border-transparent"></div>
        </div>
      ) : (
        <AnimatePresence>
          {validVouchers.length > 0 ? (
            validVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                isActive={activeCode === voucher.name}
                onApply={handleApply}
                onCopy={handleCopy}
                copiedCode={copiedCode}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <svg
                className="w-20 h-20 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-700">
                Hiện không có voucher khả dụng
              </h3>
              <p className="mt-1 text-gray-500">
                Vui lòng quay lại sau để nhận thêm ưu đãi 🎁
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default VoucherList;
