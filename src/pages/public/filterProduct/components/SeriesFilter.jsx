import React from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";

const SeriesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { brands } = useSelector((state) => state.brand);

  const selectedBrandId = searchParams.get("brandId");
  const selectedSeriesId = searchParams.get("seriesId");

  const handleSelectSeries = (selectedOption) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (selectedOption && selectedOption.value) {
      newSearchParams.set("seriesId", selectedOption.value);
    } else {
      newSearchParams.delete("seriesId");
    }

    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  // Tìm brand đã chọn để lấy danh sách series
  const selectedBrand = brands.find(
    (brand) => brand.id.toString() === selectedBrandId
  );

  // Nếu chưa chọn brand hoặc brand không có series thì không hiển thị gì
  if (
    !selectedBrandId ||
    !selectedBrand ||
    !selectedBrand.series ||
    selectedBrand.series.length === 0
  ) {
    return null;
  }

  // Tạo options cho react-select từ series của brand đã chọn
  const seriesOptions = selectedBrand.series.map((series) => ({
    value: series.id.toString(),
    label: series.name,
  }));

  // Tìm option đang được chọn
  const selectedOption =
    seriesOptions.find((option) => option.value === selectedSeriesId) || null;

  // Custom styles cho react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      borderRadius: "12px",
      padding: "4px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      minHeight: "48px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "12px 16px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
      fontWeight: "500",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: "1px solid #e5e7eb",
    }),
    menuPortal: (base) => {
      return {
        ...base,
        zIndex: 9999,
      };
    },
  };

  // Custom component để hiển thị option với description
  const formatOptionLabel = ({ label }) => (
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <div>
      <Select
        value={selectedOption}
        onChange={handleSelectSeries}
        options={seriesOptions}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        placeholder="Chọn dòng sản phẩm..."
        isClearable={true}
        isSearchable={true}
        className="text-sm"
        classNamePrefix="react-select"
        noOptionsMessage={() => "Không tìm thấy dòng sản phẩm"}
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default SeriesFilter;
