// src/components/voucher/VoucherCard.jsx

import { Ticket, Copy, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { showToastSuccess } from "~/utils/alert";

const formatNumber = (num) => {
  if (typeof num !== "number" || isNaN(num)) return num;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

// --- Component con cho phần chi tiết (Đã cập nhật) ---
const ExpandedDetails = ({ promotion, isActive }) => {
  const {
    description,
    promoCode,
    maxValue,
    usageCount = 0, // Giá trị mặc định
    usageLimit, // Có thể là null nếu không giới hạn
  } = promotion;

  // --- Logic hiển thị lượt sử dụng ---
  const isUnlimited = !usageLimit || usageLimit === 0;
  const isFullyUsed = !isUnlimited && usageCount >= usageLimit;
  const usagePercentage =
    isUnlimited || isFullyUsed
      ? 100
      : Math.round((usageCount / usageLimit) * 100);

  let progressBarColor = isActive ? "bg-yellow-500" : "bg-blue-400";
  if (usagePercentage > 85) {
    progressBarColor = "bg-red-500";
  } else if (usagePercentage > 60) {
    progressBarColor = "bg-orange-500";
  }

  // --- Styling động ---
  const labelColor = isActive ? "text-slate-500" : "text-blue-200";
  const valueColor = isActive
    ? "text-slate-800 font-semibold"
    : "text-white font-semibold";

  return (
    <div className="space-y-4 pt-4 mt-4 border-t border-white/20">
      {description && (
        <p className={`text-sm italic ${labelColor}`}>"{description}"</p>
      )}

      {/* === PHẦN HIỂN THỊ USAGE MỚI === */}
      <div>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className={labelColor}>Lượt sử dụng:</span>
          {isUnlimited ? (
            <span className={`${valueColor} text-green-400`}>
              Không giới hạn
            </span>
          ) : (
            <span className={valueColor}>
              {usageCount.toLocaleString()} / {usageLimit.toLocaleString()}
            </span>
          )}
        </div>
        {!isUnlimited && (
          <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        )}
      </div>

      {maxValue > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className={labelColor}>Giảm tối đa:</span>
          <span className={valueColor}>{formatNumber(maxValue)}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className={`${labelColor} text-sm`}>Mã:</span>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-md border-2 border-dashed ${
              isActive ? "border-yellow-500/50 bg-white/50" : "border-white/50"
            } font-mono tracking-widest ${valueColor}`}
          >
            {promoCode}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(promoCode);
              showToastSuccess("Đã sao chép mã!");
            }}
            className={`p-1.5 rounded-md transition-colors ${
              isActive ? "hover:bg-yellow-300" : "hover:bg-white/20"
            }`}
            title="Sao chép mã"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Component chính (Đã cập nhật) ---
const VoucherCard = ({ promotion, isActive = false, handleApplyDiscount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!promotion) return null;

  const { code: promoCode, ...restOfPromotion } = promotion;
  const fullPromotion = { promoCode, ...restOfPromotion };

  const {
    name,
    discountUnit,
    discountValue,
    minOrderValue,
    startDate,
    endDate,
    usageCount = 0, // Lấy ra ở đây để kiểm tra
    usageLimit,
  } = fullPromotion;

  // Kiểm tra xem voucher đã hết lượt chưa
  const isFullyUsed = usageLimit && usageCount >= usageLimit;

  // --- Styling động ---
  const baseBg = "bg-gradient-to-br from-blue-600 to-indigo-700 text-white";
  const activeBg =
    "bg-gradient-to-br from-yellow-100 to-amber-200 text-slate-800";
  const baseRing = "hover:shadow-lg hover:-translate-y-1";
  const activeRing =
    "ring-2 ring-yellow-500 ring-offset-2 scale-[1.02] shadow-xl";
  const valueColor = isActive
    ? "text-slate-800 font-semibold"
    : "text-white font-semibold";
  const labelColor = isActive ? "text-slate-500" : "text-blue-200";

  return (
    <div
      className={`relative flex flex-col p-5 rounded-xl transition-all duration-300 shadow-md overflow-hidden ${
        isActive ? activeBg : baseBg
      } ${isActive ? activeRing : baseRing} ${
        isFullyUsed && !isActive ? "opacity-60" : ""
      }`}
    >
      {/* Ribbon nếu đang active */}
      {isActive && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-bl-lg shadow-md z-10">
          ĐÃ ÁP DỤNG
        </div>
      )}
      {/* Ribbon nếu hết lượt */}
      {isFullyUsed && (
        <div className="absolute top-3 left-[-35px] -rotate-45 bg-red-600 text-white text-xs font-bold w-32 text-center py-1 shadow-md z-10">
          HẾT LƯỢT
        </div>
      )}
      {/* --- PHẦN LUÔN HIỂN THỊ (COMPACT VIEW) --- */}
      <div className="flex items-start gap-4">
        <div
          className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full shadow-inner ${
            isActive ? "bg-white/70 text-yellow-600" : "bg-white/20 text-white"
          }`}
        >
          <Ticket size={28} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold leading-tight ${valueColor}`}>
            {name || "Ưu đãi đặc biệt"}
          </h3>
          <p className="text-sm mt-1">
            <span className="font-semibold">
              {discountUnit === "PERCENT"
                ? `Giảm ${discountValue}%`
                : `Giảm ${formatNumber(discountValue)}`}
            </span>
            <span> cho đơn từ {formatNumber(minOrderValue)}</span>
          </p>
          <div className="flex items-center gap-2 text-xs opacity-90">
            <Calendar size={14} className={labelColor} />
            <span>
              Hiệu lực: {moment(startDate).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
      </div>

      {/* --- PHẦN CHI TIẾT (EXPANDED VIEW) --- */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ExpandedDetails promotion={fullPromotion} isActive={isActive} />
      </div>

      {/* --- CHÂN CARD (ACTIONS) --- */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm font-semibold py-2 px-3 rounded-md hover:bg-black/10 transition-colors"
        >
          {isExpanded ? "Thu gọn" : "Xem chi tiết"}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {handleApplyDiscount && (
          <button
            disabled={isFullyUsed} // Vô hiệu hóa nút nếu hết lượt
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform active:scale-95 shadow-sm ${
              isFullyUsed
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : isActive
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-yellow-400 text-slate-800 hover:bg-yellow-300"
            }`}
            onClick={() => {
              handleApplyDiscount(promoCode);
            }}
          >
            {isFullyUsed ? "Hết lượt" : isActive ? "Bỏ chọn" : "Áp dụng"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherCard;
