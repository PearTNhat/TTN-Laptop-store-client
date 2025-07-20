import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const formatNumber = (num) => (num || 0).toLocaleString("vi-VN");

const OrderSummary = ({ order, discountAmount }) => {
  const finalTotal = order?.totalAmount || 10 - discountAmount;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaShoppingCart className="text-blue-600" />
        Đơn hàng của bạn
      </h2>

      <div className="space-y-4">
        {order?.items?.map((item) => {
          // Xây dựng chuỗi chi tiết sản phẩm một cách linh hoạt
          const productDetails = [
            item.color?.name, // Dùng optional chaining `?.` để tránh lỗi nếu `item.color` không tồn tại
            item.ram,
            item.hardDrive,
          ]
            .filter(Boolean) // Lọc ra các giá trị null, undefined hoặc rỗng
            .join(" • "); // Nối chúng lại với nhau
          return (
            <div
              key={item.productDetailId}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-16 h-16 rounded-lg object-cover shadow-sm"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600">
                  SL: {item.quantity}
                  {productDetails && ` • ${productDetails}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600 text-lg">
                  {formatNumber(item.discountPrice)} đ
                </p>
                <p className="text-sm text-gray-500 line-through">
                  {formatNumber(item.originalPrice)} đ
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Tổng tiền hàng:</span>
            <span className="font-semibold">
              {formatNumber(order?.totalAmount)} đ
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá voucher:</span>
              <span className="font-semibold">
                - {formatNumber(discountAmount)} đ
              </span>
            </div>
          )}

          <div className="flex justify-between text-gray-700">
            <span>Phí vận chuyển:</span>
            <span className="font-semibold text-green-600">Miễn phí</span>
          </div>

          <div className="flex justify-between text-xl font-bold text-blue-600 pt-3 border-t border-gray-200">
            <span>Thành tiền:</span>
            <span>{formatNumber(finalTotal > 0 ? finalTotal : 0)} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
