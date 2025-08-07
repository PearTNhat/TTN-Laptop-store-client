import React from "react";
import { Controller } from "react-hook-form";

const promotionTypes = [
  { value: "USER_PROMOTION", label: "Khuyến mãi người dùng" },
  { value: "PRODUCT_DISCOUNT", label: "Giảm giá sản phẩm" },
  { value: "GIFT", label: "Quà tặng" },
  { value: "SHOP_DISCOUNT", label: "Giảm giá cửa hàng" },
  { value: "ALL_USER", label: "Tất cả người dùng" },
  { value: "ALL_PRODUCT", label: "Tất cả sản phẩm" },
];

const BasicInfoForm = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      {/* Tên và mã khuyến mãi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên khuyến mãi *
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Nhập tên khuyến mãi"
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã khuyến mãi *
          </label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono transition-colors"
                placeholder="Nhập mã khuyến mãi"
              />
            )}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả *
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Nhập mô tả khuyến mãi"
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Loại khuyến mãi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loại khuyến mãi *
        </label>
        <Controller
          name="promotionType"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {promotionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
