import React from "react";
import { FiGrid } from "react-icons/fi";

const SeriesStat = ({ total }) => {
  return (
    <div className="mb-6 w-full max-w-xs">
      <div className="w-full p-4 rounded-lg shadow-md border border-gray-100 bg-white group transition-all hover:scale-[1.01] hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-indigo-600 transition-colors">
              Tổng dòng sản phẩm
            </p>
            <p className="text-2xl font-bold text-gray-900 leading-none group-hover:text-indigo-700 transition-colors">
              {total}
            </p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-full shadow-sm group-hover:bg-indigo-100 transition">
            <FiGrid size={24} className="text-indigo-600 group-hover:text-indigo-800 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesStat;