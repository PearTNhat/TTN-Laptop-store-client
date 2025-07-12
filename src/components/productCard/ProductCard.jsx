import React from "react";
import { FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";
import {
  formatPrice,
  convertNumberToStar,
  calculatePercent,
} from "~/utils/helper";
import { Link } from "react-router-dom";
import { DefaultProduct } from "~/assets/images";

const ProductCard = ({ product }) => {
  const discountPercent = calculatePercent(
    product.originalPrice,
    product.discountPrice
  );
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 relative">
      {/* Badge giảm giá */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            -{discountPercent}%
          </span>
        </div>
      )}

      {/* Hình ảnh sản phẩm */}
      <Link to={`/products/${product.productId}`}>
        <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 overflow-hidden">
          <img
            src={product.itemImage || DefaultProduct}
            alt={product.title}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay gradient khi hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="p-5">
        {/* Tên sản phẩm */}
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-2 group-hover:text-blue-600">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1 text-yellow-400">
            {convertNumberToStar(product.totalRating).map((star, index) => (
              <span key={index} className="text-sm">
                {star}
              </span>
            ))}
          </div>
        </div>

        {/* Giá */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-xl font-bold text-red-600">
              {formatPrice(product.discountPrice)}
            </span>
            {product.originalPrice &&
              product.originalPrice > product.discountPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
          </div>
        </div>

        {/* Nút thêm vào giỏ hàng */}
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group/btn transform hover:scale-105 shadow-lg hover:shadow-xl">
          <FaShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce" />
          <span>Thêm vào giỏ</span>
        </button>

        {/* Thông tin thêm */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>🛡️ Bảo hành {product.warranty || "12"} tháng</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
