import React from "react";
import { FaFolder } from "react-icons/fa";

const CategoryTableRow = ({ category, onEdit, onDelete }) => {
  return (
    <tr className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-l-4 border-transparent hover:border-blue-300">
      {/* Ảnh + Tên + Mô tả danh mục */}
      <td className="px-6 py-6">
        <div className="flex items-center space-x-4">
          {/* Hình ảnh hoặc biểu tượng */}
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:border-blue-300 transition-colors duration-200">
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <FaFolder className="text-blue-500 text-2xl" />
            )}
          </div>

          {/* Tên và mô tả */}
          <div className="flex flex-col justify-center space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                {category.name || "Không tên"}
              </h3>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {category.description || "Chưa có mô tả cho danh mục này"}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>ID: {category.id}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Hành động */}
      <td className="px-6 py-6">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onEdit(category)}
            className="group/btn flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-200 rounded-lg border border-blue-200 hover:border-blue-600 hover:shadow-lg transform hover:scale-105"
            title="Chỉnh sửa danh mục"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="hidden sm:block text-sm font-medium">Sửa</span>
          </button>
          <button
            onClick={() => onDelete(category)}
            className="group/btn flex items-center gap-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200 rounded-lg border border-red-200 hover:border-red-600 hover:shadow-lg transform hover:scale-105"
            title="Xóa danh mục"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:block text-sm font-medium">Xóa</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryTableRow;
