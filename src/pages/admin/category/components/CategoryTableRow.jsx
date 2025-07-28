import React from "react";

const CategoryTableRow = ({ category, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-900/5 transition-all duration-300 text-[15px]">
      {/* Tên và mô tả danh mục */}
      <td className="px-6 py-6 whitespace-nowrap">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-gray-900 truncate">
            {category.name}
          </div>
          <div className="text-base text-gray-600 truncate">
            {category.description || "-"}
          </div>
        </div>
      </td>

      {/* Ngày tạo */}
      <td className="px-6 py-6 text-sm text-gray-700 text-center">
        {new Date(category.createdDate || "2024-01-01").toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </td>

      {/* Hành động */}
      <td className="px-6 py-6 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-indigo-500 hover:text-indigo-700 transition-colors rounded-full hover:bg-indigo-50"
            title="Chỉnh sửa"
            aria-label="Edit category"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
            title="Xóa"
            aria-label="Delete category"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryTableRow;
