import React from "react";

const ColorTableRow = ({ color, onEdit, onDelete }) => {
  return (
    <tr className="group transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border-b border-gray-200">
      {/* Preview màu */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: color.hex }}
          ></div>
          <span className="text-lg font-semibold text-gray-800 tracking-tight group-hover:text-indigo-700 truncate">
            {color?.name || "Không tên"}
          </span>
        </div>
      </td>
      
      {/* Mã HEX */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center h-full">
          <code className="px-3 py-1.5 bg-gray-100 rounded-md text-gray-700 font-mono">
            {color?.hex || "#000000"}
          </code>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(color)}
            className="p-2.5 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all duration-300 rounded-lg border border-indigo-300 hover:shadow-md"
            title="Chỉnh sửa"
            aria-label="Edit color"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(color)}
            className="p-2.5 text-red-600 hover:text-white hover:bg-red-600 transition-all duration-300 rounded-lg border border-red-300 hover:shadow-md"
            title="Xóa"
            aria-label="Delete color"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ColorTableRow;