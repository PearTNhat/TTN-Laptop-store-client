import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { fakeBrands } from "~/data/fakeData";

// --- Giả lập API call cho brands ---
const fetchBrandsAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeBrands);
    }, 300);
  });
};

const BrandFilter = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedBrandIds = searchParams.get("brandIds")?.split(",") || [];

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchBrandsAPI();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, []);

  const handleSelectBrands = (selectedOptions) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (selectedOptions && selectedOptions.length > 0) {
      const brandIds = selectedOptions.map((option) => option.value);
      newSearchParams.set("brandIds", brandIds.join(","));
    } else {
      newSearchParams.delete("brandIds");
    }

    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };

  // Tạo options cho react-select
  const brandOptions = brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
    logo: brand.logo,
  }));

  // Tìm options đang được chọn
  const selectedOptions = brandOptions.filter((option) =>
    selectedBrandIds.includes(option.value)
  );

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
  const formatOptionLabel = ({ label, logo }) => (
    <div className="flex items-center space-x-2">
      <span className="text-lg">{logo}</span>
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
        isMulti
        value={selectedOptions}
        onChange={handleSelectBrands}
        options={brandOptions}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        placeholder="Chọn thương hiệu..."
        isClearable={true}
        isSearchable={true}
        className="text-sm"
        classNamePrefix="react-select"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        noOptionsMessage={() => "Không tìm thấy thương hiệu"}
        menuPortalTarget={document.body}
      />

      {/* Hiển thị số lượng thương hiệu đã chọn */}
      {selectedOptions.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Đã chọn {selectedOptions.length} thương hiệu
        </div>
      )}
    </div>
  );
};

export default BrandFilter;
