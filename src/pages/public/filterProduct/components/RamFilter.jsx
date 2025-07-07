import React from "react";
import { useSearchParams } from "react-router-dom";

const RAM_OPTIONS = [
  { value: "8GB", label: "8GB", popular: true },
  { value: "16GB", label: "16GB", popular: true },
  { value: "32GB", label: "32GB", popular: false },
  { value: "64GB", label: "64GB", popular: false },
];

const RamFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRam = searchParams.get("ram")?.split(",") || [];

  const handleRamChange = (ramValue) => {
    const isSelected = selectedRam.includes(ramValue);
    const newSelectedRam = isSelected
      ? selectedRam.filter((r) => r !== ramValue)
      : [...selectedRam, ramValue];

    const newSearchParams = new URLSearchParams(searchParams);

    if (newSelectedRam.length > 0) {
      newSearchParams.set("ram", newSelectedRam.join(","));
    } else {
      newSearchParams.delete("ram");
    }

    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  return (
    <div className="space-y-3">
      {/* Hiển thị số lượng đã chọn */}
      {selectedRam.length > 0 && (
        <div className="text-sm text-blue-600 font-medium">
          Đã chọn {selectedRam.length} loại RAM
        </div>
      )}

      {/* Grid layout cho các option */}
      <div className="grid grid-cols-2 gap-3">
        {RAM_OPTIONS.map((ram) => {
          const isSelected = selectedRam.includes(ram.value);
          return (
            <button
              key={ram.value}
              onClick={() => handleRamChange(ram.value)}
              className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {ram.popular && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Hot
                </div>
              )}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{ram.icon}</span>
                <span className="font-semibold">{ram.label}</span>
              </div>
              {isSelected && (
                <div className="absolute top-2 left-2 text-blue-500">✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RamFilter;
