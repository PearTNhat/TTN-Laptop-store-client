import React from "react";
import {
  FaTimes,
  FaGift,
  FaPercent,
  FaDollarSign,
  FaCalendarAlt,
  FaUsers,
  FaTag,
  FaBox,
} from "react-icons/fa";
import {
  formatDiscount,
  getPromotionTypeColor,
  getPromotionTypeIcon,
  getPromotionTypeText,
} from "../utils/helper";
import PromotionDetailList from "./PromotionDetailList";
import { formatDateSencond } from "~/utils/helper";

const PromotionDetailModal = ({ promotion, isOpen, onClose }) => {
  if (!isOpen || !promotion) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getUsagePercentage = () => {
    if (promotion.usageLimit === 0) return 0;
    return Math.round((promotion.usageCount / promotion.usageLimit) * 100);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getPromotionTypeIcon(promotion.promotionType)}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {promotion.name}
              </h2>
              <p className="text-gray-600">Chi tiết khuyến mãi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã khuyến mãi
                </label>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <span className="font-mono text-lg font-bold text-gray-800">
                    {promotion.code}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại khuyến mãi
                </label>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${getPromotionTypeColor(
                    promotion.promotionType
                  )}`}
                >
                  {getPromotionTypeIcon(promotion.promotionType)}
                  {getPromotionTypeText(promotion.promotionType)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                  {promotion.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị giảm
                  </label>
                  <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                    {promotion.discountUnit === "PERCENT" ? (
                      <FaPercent className="text-lg" />
                    ) : (
                      <FaDollarSign className="text-lg" />
                    )}
                    {formatDiscount(promotion)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn tối thiểu
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(promotion.minOrderValue)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảm tối đa
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(promotion.maxDiscountValue)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người tạo
                </label>
                <p className="text-gray-900 font-medium">
                  {promotion.username || "Không có thông tin"}
                </p>
                <p className="text-sm text-gray-600">
                  ID: {promotion.userId || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thống kê sử dụng
            </h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Giới hạn sử dụng</p>
                  <p className="text-2xl font-bold  text-blue-600">
                    {promotion.usageLimit == undefined
                      ? "Không giới hạn"
                      : promotion.usageLimit}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Đã sử dụng</p>
                  <p className="text-2xl font-bold text-green-600">
                    {promotion.usageCount}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {promotion.usageLimit == undefined
                      ? "Không giới hạn"
                      : promotion.usageLimit - promotion.usageCount}
                  </p>
                </div>
              </div>

              {promotion.usageLimit > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tiến độ sử dụng</span>
                    <span className="text-gray-600">
                      {getUsagePercentage()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${getUsagePercentage()}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thời gian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-blue-600" />
                  <p className="font-medium text-blue-900">Ngày bắt đầu</p>
                </div>
                <p className="text-blue-800 font-semibold">
                  {formatDateSencond(promotion.startDate)}
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-red-600" />
                  <p className="font-medium text-red-900">Ngày kết thúc</p>
                </div>
                <p className="text-red-800 font-semibold">
                  {formatDateSencond(promotion.endDate)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-gray-600" />
                  <p className="font-medium text-gray-900">Ngày tạo</p>
                </div>
                <p className="text-gray-800 font-semibold">
                  {formatDateSencond(promotion.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          {promotion.productDetailIds &&
            promotion.productDetailIds.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sản phẩm áp dụng
                </h3>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-yellow-800">
                    <strong>Số lượng sản phẩm:</strong>{" "}
                    {promotion.productDetailIds.length}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Product Detail IDs: {promotion.productDetailIds.join(", ")}
                  </p>
                </div>
              </div>
            )}

          {/* Detail Data Section */}
          {promotion.detailData && promotion.detailData.length > 0 ? (
            <div className="mb-6">
              <PromotionDetailList
                detailData={promotion.detailData}
                type={promotion.detailData[0]?.userId ? "user" : "product"}
              />
            </div>
          ) : (
            promotion.productDetailIds &&
            promotion.productDetailIds.length > 0 && (
              <div className="mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="animate-pulse w-4 h-4 bg-blue-400 rounded-full"></div>
                    <p className="text-blue-800 font-medium">
                      Đang tải thông tin chi tiết...
                    </p>
                  </div>
                  <p className="text-sm text-blue-700">
                    Áp dụng cho {promotion.productDetailIds.length} mục
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailModal;
