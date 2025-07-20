// src/components/voucher/VoucherCard.jsx
import { Ticket, CheckCircle } from "lucide-react";
import moment from "moment";
import React from "react";

// Giả lập hàm formatNumber vì nó không có trong file này
const formatNumber = (num) => {
  if (typeof num !== "number") return num;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

const VoucherCard = ({ promotion, isActive = false, hanleApplyDiscount }) => {
  if (!promotion) return null;
  const labelColor = isActive ? "text-yellow-900/80" : "text-blue-200/80";
  const valueColor = isActive ? "text-blue-900 font-semibold" : "text-white";

  return (
    <div
      key={promotion.promotionId}
      className={`relative p-4 mb-4 rounded-lg transition-all duration-300 shadow-md overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 text-blue-900 ring-2 ring-yellow-500 scale-[1.02]"
          : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:shadow-lg"
      }`}
    >
      {/* Ribbon nếu đang active */}
      {isActive && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-bl-lg shadow-md">
          Đã áp dụng
        </div>
      )}

      <div className="flex items-center">
        <div
          className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full shadow-md mr-4 ${
            isActive ? "bg-white text-yellow-600" : "bg-white text-blue-600"
          }`}
        >
          {isActive ? <CheckCircle size={24} /> : <Ticket size={24} />}
        </div>
        <div className="flex-1 text-sm space-y-1">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
            <div>
              <span className={`font-bold mr-1.5 ${labelColor}`}>Giảm:</span>
              <span className={valueColor}>
                {promotion.discountType === "PERCENTATE"
                  ? `${promotion.discountValue}%`
                  : formatNumber(promotion.discountValue)}
              </span>
            </div>
            <div>
              <span className={`font-bold mr-1.5 ${labelColor}`}>
                Đơn tối thiểu:
              </span>
              <span className={valueColor}>
                {formatNumber(promotion.minOrderValue)}
              </span>
            </div>
            <div>
              <span className={`font-bold mr-1.5 ${labelColor}`}>Mã:</span>
              <span className={`${valueColor} tracking-wider font-mono`}>
                {promotion.promoCode}
              </span>
            </div>
          </div>
          <p className="text-xs italic opacity-80 pt-1">
            HSD: {moment(promotion.endDate).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex space-x-3">
        <button
          className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-transform transform active:scale-95 ${
            isActive
              ? "bg-white/80 text-yellow-800 hover:bg-white"
              : "bg-white/90 text-blue-600 hover:bg-white"
          }`}
          onClick={() => navigator.clipboard.writeText(promotion.promoCode)}
        >
          Sao chép mã
        </button>
        {hanleApplyDiscount && (
          <button
            className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-transform transform active:scale-95 ${
              isActive
                ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                : "bg-yellow-400 text-blue-900 hover:bg-yellow-500"
            }`}
            onClick={() => hanleApplyDiscount(promotion.promoCode)}
          >
            {isActive ? "Bỏ chọn" : "Áp dụng"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherCard;
