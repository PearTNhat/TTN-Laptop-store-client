import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";
const CategoryFilter = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useSelector((state) => state.category);
  const selectedCategoryId = searchParams.get("categoryId");
  console.log("Selected Category ID:", selectedCategoryId);

  const handleSelectCategory = (selectedOption) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (selectedOption && selectedOption.value) {
      newSearchParams.set("categoryId", selectedOption.value);
    } else {
      newSearchParams.delete("categoryId");
    }

    newSearchParams.set("page", "0");
    setSearchParams(newSearchParams);
  };
  useEffect(() => {
    const categoryOptions = categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
    setCategoryOptions(categoryOptions);
  }, [categories]);
  // Tạo options cho react-select
  console.log("Category Options:", categoryOptions);
  // Tìm option đang được chọn
  const selectedOption =
    categoryOptions.find((option) => option.value === selectedCategoryId) ||
    null;
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

  // Custom component để hiển thị option với icon
  const formatOptionLabel = ({ label }) => (
    <div className="flex items-center space-x-2">
      <span>{label}</span>
    </div>
  );

  return (
    <div>
      <Select
        value={selectedOption}
        onChange={handleSelectCategory}
        options={categoryOptions}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        placeholder="Chọn danh mục..."
        isClearable={true}
        isSearchable={true}
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default CategoryFilter;
