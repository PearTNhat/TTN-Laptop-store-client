import React from "react";
import { useSearchParams } from "react-router-dom";

const SSD_OPTIONS = [
  { value: "256GB", label: "256GB", popular: false },
  { value: "512GB", label: "512GB", popular: true },
  { value: "1TB", label: "1TB", popular: true },
  { value: "2TB", label: "2TB", popular: false },
];

const SsdFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSsd = searchParams.get("ssd")?.split(",") || [];

  const handleSsdChange = (ssdValue) => {
    const isSelected = selectedSsd.includes(ssdValue);
    const newSelectedSsd = isSelected
      ? selectedSsd.filter((s) => s !== ssdValue)
      : [...selectedSsd, ssdValue];

    const newSearchParams = new URLSearchParams(searchParams);

    if (newSelectedSsd.length > 0) {
      newSearchParams.set("ssd", newSelectedSsd.join(","));
    } else {
      newSearchParams.delete("ssd");
    }

    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  return (
    <div className="space-y-3">
      {/* Hiển thị số lượng đã chọn */}
      {selectedSsd.length > 0 && (
        <div className="text-sm text-blue-600 font-medium">
          Đã chọn {selectedSsd.length} loại SSD
        </div>
      )}

      {/* Grid layout cho các option */}
      <div className="grid grid-cols-2 gap-3">
        {SSD_OPTIONS.map((ssd) => {
          const isSelected = selectedSsd.includes(ssd.value);
          return (
            <button
              key={ssd.value}
              onClick={() => handleSsdChange(ssd.value)}
              className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                isSelected
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              {ssd.popular && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{ssd.icon}</span>
                <span className="font-semibold">{ssd.label}</span>
              </div>
              {isSelected && (
                <div className="absolute top-2 left-2 text-purple-500">✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SsdFilter;
