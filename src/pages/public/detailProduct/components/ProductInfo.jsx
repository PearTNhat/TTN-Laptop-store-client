import { useCallback } from "react";
import { capitalizeFirstCharacter, convertNumberToStar } from "~/utils/helper";

function ProductInfo({ product }) {
  const stars = useCallback(() => {
    return convertNumberToStar(product?.totalRating);
  }, [product]);

  return (
    <div className="mb-6">
      {/* Product Title */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-gray-500 text-sm">Thương hiệu:</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            {capitalizeFirstCharacter(product.brand || "")}
          </span>
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
        <div className="flex items-center text-yellow-500 text-xl">
          {stars().map((star, index) => (
            <span
              key={index}
              className="drop-shadow-sm hover:scale-110 transition-transform duration-200"
            >
              {star}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm font-medium">
            ({product.totalRating} đánh giá)
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-semibold">
            Đánh giá tốt
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-semibold">
            Uy tín
          </span>
        </div>
      </div>

      {/* Warranty & Service Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <span className="text-blue-500 text-xl">🛡️</span>
          <span className="text-blue-700 font-semibold text-sm">
            Bảo hành 2 năm
          </span>
        </div>
        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
          <span className="text-green-500 text-xl">🚚</span>
          <span className="text-green-700 font-semibold text-sm">
            Giao hàng nhanh
          </span>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg border border-purple-200">
          <span className="text-purple-500 text-xl">💎</span>
          <span className="text-purple-700 font-semibold text-sm">
            Chính hãng 100%
          </span>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-200">
          <span className="text-orange-500 text-xl">🔧</span>
          <span className="text-orange-700 font-semibold text-sm">
            Hỗ trợ 24/7
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
