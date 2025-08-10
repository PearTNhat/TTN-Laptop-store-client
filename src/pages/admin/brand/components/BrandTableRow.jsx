import React from "react";
import PropTypes from "prop-types";

const BrandTableRow = ({ brand, onEdit, onDelete }) => {
  console.log("BrandTableRow brand:", brand);
  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    brand.name
  )}&background=4F46E5&color=fff&size=64&format=png&font-size=0.33`;

  const handleImageError = (e) => {
    e.target.src = fallbackLogo;
  };

  return (
    <tr className="group transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border-b border-gray-200">
      {/* Logo & Info */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center space-x-5">
          <div
            className="relative p-2 rounded-xl shadow-lg w-[90px] h-[90px] flex items-center justify-center"
            style={{ background: brand.bgColor}} // ✅ dùng color từ brand
          >
            <img
              src={brand.image || fallbackLogo}
              alt={brand.name}
              className="w-[60px] h-[60px] rounded-full object-contain bg-white p-1 border-2 border-white shadow-md transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/40 group-hover:ring-indigo-400 transition-all duration-300"></div>
          </div>

          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-800 tracking-tight group-hover:text-indigo-700 truncate">
              {brand.name}
            </div>
            <div className="text-sm text-gray-500 mt-1 truncate">
              {brand.description || "Chưa có mô tả"}
            </div>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(brand)}
            className="p-2.5 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all duration-300 rounded-lg border border-indigo-300 hover:shadow-md"
            title="Chỉnh sửa"
            aria-label="Edit brand"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(brand)}
            className="p-2.5 text-red-600 hover:text-white hover:bg-red-600 transition-all duration-300 rounded-lg border border-red-300 hover:shadow-md"
            title="Xóa"
            aria-label="Delete brand"
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

BrandTableRow.propTypes = {
  brand: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    color: PropTypes.string, // ✅ thêm color
    image: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BrandTableRow;
