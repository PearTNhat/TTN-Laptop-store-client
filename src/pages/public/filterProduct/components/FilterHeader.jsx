import React from "react";
import { useSearchParams } from "react-router-dom";

const FilterHeader = ({ totalProducts = 0 }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy các filter đang active
  const getActiveFilters = () => {
    const filters = [];

    if (searchParams.get("categoryId")) {
      filters.push({
        key: "categoryId",
        label: "Danh mục",
        value: searchParams.get("categoryId"),
      });
    }

    if (searchParams.get("brandIds")) {
      const brands = searchParams.get("brandIds").split(",");
      filters.push({
        key: "brandIds",
        label: "Thương hiệu",
        value: `${brands.length} thương hiệu`,
      });
    }

    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
      const min = searchParams.get("minPrice") || "0";
      const max = searchParams.get("maxPrice") || "50,000,000";
      filters.push({ key: "price", label: "Giá", value: `${min} - ${max}` });
    }

    if (searchParams.get("ram")) {
      const rams = searchParams.get("ram").split(",");
      filters.push({ key: "ram", label: "RAM", value: rams.join(", ") });
    }

    if (searchParams.get("ssd")) {
      const ssds = searchParams.get("ssd").split(",");
      filters.push({ key: "ssd", label: "SSD", value: ssds.join(", ") });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  const removeFilter = (filterKey) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (filterKey === "price") {
      newSearchParams.delete("minPrice");
      newSearchParams.delete("maxPrice");
    } else {
      newSearchParams.delete(filterKey);
    }

    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-600">
            Bộ lọc đang áp dụng:
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.key}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 text-sm"
              >
                <span className="font-medium text-blue-700">
                  {filter.label}:
                </span>
                <span className="text-blue-600">{filter.value}</span>
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="text-blue-400 hover:text-red-500 ml-2 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* No filters applied */}
      {activeFilters.length === 0 && (
        <div className="text-gray-500 text-sm">
          💡 Sử dụng bộ lọc bên trái để tìm kiếm sản phẩm phù hợp
        </div>
      )}
    </div>
  );
};

export default FilterHeader;
