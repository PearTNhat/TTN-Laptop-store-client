import { calculatePercent, formatNumber } from "~/utils/helper";

function ProductPrice({ colorProduct }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl my-6 border border-blue-100 shadow-inner">
      <div className="flex items-baseline gap-4 mb-3">
        <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          {formatNumber(colorProduct.discountPrice)} ₫
        </p>
        {colorProduct.originalPrice > 0 && (
          <p className="line-through text-gray-400 text-xl">
            {formatNumber(colorProduct.originalPrice)} ₫
          </p>
        )}
      </div>

      {colorProduct.originalPrice > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-gray-600 text-sm">Tiết kiệm:</span>
          <span className="text-blue-600 font-bold text-lg">
            {formatNumber(
              colorProduct.originalPrice - colorProduct.discountPrice
            )}{" "}
            ₫
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            -
            {calculatePercent(
              colorProduct.originalPrice,
              colorProduct.discountPrice
            )}
            %
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            💰 Siêu tiết kiệm
          </span>
        </div>
      )}

      {/* Quantity sold indicator */}
      <div className="mt-3 bg-white/50 rounded-lg p-2 inline-block">
        <span className="text-gray-600 text-sm">📊 Đã bán: </span>
        <span className="font-bold text-blue-600">127 sản phẩm</span>
      </div>
    </div>
  );
}

export default ProductPrice;
