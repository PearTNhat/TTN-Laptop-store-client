import React from "react";

const ColorTableRow = ({ color, onEdit, onDelete }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <tr className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-l-4 border-transparent hover:border-purple-300">
      {/* Preview màu */}
      <td className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-200 flex-shrink-0"
              style={{ backgroundColor: color.hex }}
            ></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color.hex }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
                {color?.name || "Không tên"}
              </h3>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
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
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"
                />
              </svg>
              <span>ID: {color.id}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Mã HEX */}
      <td className="px-6 py-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(color?.hex || "#000000")}
            className="group/hex flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Nhấp để sao chép"
          >
            <code className="font-mono text-lg font-bold text-gray-800 group-hover/hex:text-purple-700">
              {color?.hex || "#000000"}
            </code>
            <svg
              className="w-4 h-4 text-gray-400 group-hover/hex:text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-6">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onEdit(color)}
            className="group/btn flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-white hover:bg-purple-600 transition-all duration-200 rounded-lg border border-purple-200 hover:border-purple-600 hover:shadow-lg transform hover:scale-105"
            title="Chỉnh sửa màu sắc"
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
            onClick={() => onDelete(color)}
            className="group/btn flex items-center gap-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200 rounded-lg border border-red-200 hover:border-red-600 hover:shadow-lg transform hover:scale-105"
            title="Xóa màu sắc"
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

export default ColorTableRow;
