import React from "react";
import { Controller } from "react-hook-form";
import { FaPercent, FaDollarSign } from "react-icons/fa";

const DiscountSettingsForm = ({ control, errors, watchDiscountUnit }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          Cài đặt giảm giá
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Đơn vị giảm giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn vị giảm giá *
            </label>
            <Controller
              name="discountUnit"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="PERCENT">Phần trăm (%)</option>
                  <option value="AMOUNT">Số tiền (VNĐ)</option>
                </select>
              )}
            />
          </div>

          {/* Giá trị giảm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị giảm *
            </label>
            <div className="relative">
              <Controller
                name="discountValue"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step={watchDiscountUnit === "PERCENT" ? "1" : "1000"}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {watchDiscountUnit === "PERCENT" ? (
                  <FaPercent className="text-gray-400" />
                ) : (
                  <FaDollarSign className="text-gray-400" />
                )}
              </div>
            </div>
            {errors.discountValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountValue.message}
              </p>
            )}
          </div>

          {/* Giảm tối đa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giảm tối đa (VNĐ) *
            </label>
            <Controller
              name="maxDiscountValue"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="0"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.maxDiscountValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxDiscountValue.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Điều kiện áp dụng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Giá trị đơn hàng tối thiểu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị đơn hàng tối thiểu (VNĐ) *
            </label>
            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="0"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.minOrderValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minOrderValue.message}
              </p>
            )}
          </div>

          {/* Giới hạn sử dụng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới hạn sử dụng
            </label>
            <Controller
              name="usageLimit"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Để trống = Không giới hạn"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Nếu input trống hoặc bằng 0 thì set null, ngược lại set Number
                    field.onChange(
                      value === "" || Number(value) === 0 ? null : Number(value)
                    );
                  }}
                  value={field.value === null ? "" : field.value}
                />
              )}
            />
            {errors.usageLimit && (
              <p className="text-red-500 text-sm mt-1">
                {errors.usageLimit.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Để trống hoặc nhập 0 để không giới hạn số lần sử dụng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountSettingsForm;
