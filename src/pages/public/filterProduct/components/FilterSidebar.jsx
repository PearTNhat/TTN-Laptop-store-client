import React from "react";
import { useSearchParams } from "react-router-dom";
import Accordion from "./Accordion";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import PriceFilter from "./PriceFilter";
import RamFilter from "./RamFilter";
import SsdFilter from "./SsdFilter";
import RamIcon from "~/assets/images/ram.png"; // Giả sử bạn có icon RAM trong assets
const FilterSidebar = () => {
  const [, setSearchParams] = useSearchParams();

  // Hàm này sẽ xóa hết các param trên URL để reset bộ lọc
  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <aside className="w-full lg:w-1/4">
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24">
        {/* Header với gradient */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔍 BỘ LỌC
          </h2>
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-50"
          >
            🗑️ Xóa tất cả
          </button>
        </div>

        {/* Lắp ráp các bộ lọc bằng Accordion */}
        <Accordion title="📂 Danh mục" defaultOpen={true}>
          <CategoryFilter />
        </Accordion>

        <Accordion title="🏷️ Thương hiệu" defaultOpen={true}>
          <BrandFilter />
        </Accordion>

        <Accordion title="💰 Khoảng giá" defaultOpen={true}>
          <PriceFilter />
        </Accordion>

        <Accordion
          icon={<img width="30" height="30" src={RamIcon} />}
          title="RAM"
          defaultOpen={false}
        >
          <RamFilter />
        </Accordion>

        <Accordion title="💾 Ổ cứng SSD" defaultOpen={false}>
          <SsdFilter />
        </Accordion>
      </div>
    </aside>
  );
};

export default FilterSidebar;
