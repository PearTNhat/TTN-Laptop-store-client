import React from "react";
import { Controller } from "react-hook-form";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

const DateTimeForm = ({ control, errors }) => {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
        <FaCalendarAlt />
        Thời gian áp dụng
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ngày bắt đầu */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FaClock className="text-purple-600" />
            Ngày bắt đầu *
          </label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            )}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* Ngày kết thúc */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FaClock className="text-purple-600" />
            Ngày kết thúc *
          </label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            )}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-purple-600 bg-purple-100 rounded-md p-2">
        💡 Khuyến mãi sẽ tự động kích hoạt vào thời gian bắt đầu và kết thúc vào
        thời gian kết thúc
      </div>
    </div>
  );
};

export default DateTimeForm;
