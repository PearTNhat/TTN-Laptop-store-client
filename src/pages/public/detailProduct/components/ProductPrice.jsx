import React from "react";
import { calculatePercent, formatNumber } from "~/utils/helper";
import { ShoppingCart, PackageSearch } from "lucide-react";

function ProductPrice({ originalPrice, finalPrice, quantity, soldQuantity }) {
  const hasDiscount = originalPrice > finalPrice;
  const isOutOfStock = !quantity || quantity === 0;
  const totalDiscountPercent = hasDiscount
    ? calculatePercent(originalPrice, finalPrice)
    : 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl my-6 border border-blue-100 shadow-inner">
      <div className="flex items-baseline gap-4 mb-3">
        <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          {formatNumber(finalPrice)} ₫
        </p>

        {hasDiscount && (
          <p className="line-through text-gray-400 text-xl">
            {formatNumber(originalPrice)} ₫
          </p>
        )}
      </div>

      {hasDiscount && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-gray-600 text-sm">Tiết kiệm:</span>
          <span className="text-blue-600 font-bold text-lg">
            {formatNumber(originalPrice - finalPrice)} ₫
          </span>
          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            -{totalDiscountPercent}%
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            💰 Siêu tiết kiệm
          </span>
        </div>
      )}

      {/* --- PHẦN MỚI: HIỂN THỊ TỒN KHO & ĐÃ BÁN --- */}
      <div className="mt-4 flex flex-wrap gap-4 items-center">
        {/* Hiển thị số lượng đã bán */}
        <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg text-sm">
          <ShoppingCart size={16} className="text-green-600" />
          <span className="text-gray-600">Đã bán:</span>
          <span className="font-bold text-green-700">{soldQuantity || 0}</span>
        </div>

        {/* Hiển thị trạng thái tồn kho */}
        {isOutOfStock ? (
          <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-lg text-sm">
            <PackageSearch size={16} className="text-orange-600" />
            <span className="font-bold text-orange-700">Hàng sắp về</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-lg text-sm">
            <span className="text-gray-600">Tồn kho:</span>
            <span className="font-bold text-blue-700">{quantity}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPrice;
