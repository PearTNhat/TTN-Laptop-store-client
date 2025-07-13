import React from "react";

const Voucher = ({ promotion, hanleApplyDiscount, isActive }) => {
  return (
    <div
      className={`p-3 border-2 rounded-lg relative ${
        isActive
          ? "border-green-500 bg-green-50"
          : "border-dashed border-gray-300"
      }`}
    >
      <div className="font-bold text-lg">{promotion.promoCode}</div>
      <div className="text-sm text-gray-600">{promotion.description}</div>
      <button
        onClick={() => hanleApplyDiscount(promotion.promoCode)}
        className={`mt-2 px-3 py-1 rounded text-white text-sm ${
          isActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isActive ? "Bỏ chọn" : "Áp dụng"}
      </button>
    </div>
  );
};

export default Voucher;
