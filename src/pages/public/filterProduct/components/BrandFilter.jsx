import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";

const BrandFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { brands, isLoading: loading } = useSelector((state) => state.brand);

  const selectedBrandId = searchParams.get("brandId");

  const handleSelectBrand = (selectedOption) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (selectedOption && selectedOption.value) {
      newSearchParams.set("brandId", selectedOption.value);
    } else {
      newSearchParams.delete("brandId");
    }

    // Xóa series khi thay đổi brand
    newSearchParams.delete("seriesId");
    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  // Tạo options cho react-select
  const brandOptions = brands.map((brand) => ({
    value: brand.id.toString(),
    label: brand.name,
    image: brand.image,
  }));

  // Tìm option đang được chọn
  const selectedOption =
    brandOptions.find((option) => option.value === selectedBrandId) || null;

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
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#eff6ff",
      borderRadius: "8px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1e40af",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#1e40af",
      "&:hover": {
        backgroundColor: "#dc2626",
        color: "white",
      },
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

  // Custom component để hiển thị option với logo
  const formatOptionLabel = ({ label, image }) => (
    <div className="flex items-center space-x-2">
      {image && (
        <img src={image} alt={label} className="w-6 h-6 object-contain" />
      )}
      <span>{label}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div>
      <Select
        value={selectedOption}
        onChange={handleSelectBrand}
        options={brandOptions}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        placeholder="Chọn thương hiệu..."
        isClearable={true}
        isSearchable={true}
        className="text-sm"
        classNamePrefix="react-select"
        noOptionsMessage={() => "Không tìm thấy thương hiệu"}
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default BrandFilter;
