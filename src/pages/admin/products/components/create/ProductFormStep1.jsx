// src/pages/ProductManagement/components/ProductFormStep1.jsx

import React, { useState, useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FileText, LayoutGrid } from "lucide-react";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import BaseCombobox from "~/components/formFiled/BaseCombobox";
import MarkDownEditor from "~/components/MarkDownEditor";

// SỬA LỖI Ở ĐÂY: Đổi tên props từ `brandsData`, `categoriesData` thành `brands`, `categories`
const ProductFormStep1 = ({ brands, categories }) => {
  const { control, setValue } = useFormContext();
  const selectedBrandId = useWatch({ control, name: "brandId" });

  const [options, setOptions] = useState({
    brands: [],
    categories: [],
    series: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const renderBrandOption = (option) => (
    <div className="flex items-center gap-2">
      {option?.image && (
        <img
          src={option.image}
          alt={option.label}
          className="w-5 h-5 object-contain"
        />
      )}
      <span>{option.label}</span>
    </div>
  );
  useEffect(() => {
    setIsLoading(true);
    if (brands && categories) {
      setOptions((prev) => ({
        ...prev,
        brands: brands.map((b) => ({
          value: b.id,
          label: b.name,
          image: b.image,
        })),
        categories: categories.map((c) => ({ value: c.id, label: c.name })),
      }));
      setIsLoading(false);
    }
  }, [brands, categories]);

  useEffect(() => {
    if (!selectedBrandId) {
      setOptions((prev) => ({ ...prev, series: [] }));
      setValue("seriesId", undefined, { shouldValidate: true });
      return;
    }

    // SỬA LỖI Ở ĐÂY: Dùng `brands` thay vì `brandsData`
    const selectedBrand = brands.find((b) => b.id === selectedBrandId);
    if (selectedBrand && selectedBrand.series) {
      setOptions((prev) => ({
        ...prev,
        series: selectedBrand.series.map((s) => ({
          value: s.id,
          label: s.name,
        })),
      }));
    } else {
      setOptions((prev) => ({ ...prev, series: [] }));
    }
    // setValue("seriesId", undefined, { shouldValidate: true });
  }, [selectedBrandId, brands, setValue]);

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <LayoutGrid className="h-5 w-5 text-purple-500" />
            Phân loại
          </CardTitle>
          <CardDescription>
            Chọn các thuộc tính phân loại chính để giúp khách hàng dễ dàng tìm
            kiếm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BaseCombobox
                name="brandId"
                label="1. Chọn Thương hiệu"
                placeholder="Chọn thương hiệu"
                options={options.brands}
                isLoading={isLoading}
                renderOption={renderBrandOption}
                renderValue={renderBrandOption} // Dùng chung hàm render
              />
              <BaseCombobox
                name="seriesId"
                label="2. Chọn Dòng sản phẩm"
                placeholder="Vui lòng chọn thương hiệu trước"
                options={options.series}
                isLoading={false}
                disabled={!selectedBrandId || options.series.length === 0}
              />
              <BaseCombobox
                name="categoryId"
                label="3. Chọn Danh mục"
                placeholder="Chọn danh mục"
                options={options.categories}
                isLoading={isLoading}
              />
            </div>
          </CardContent>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <FileText className="h-5 w-5 text-blue-500" />
            Mô tả sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* Controller sẽ làm cầu nối giữa RHF và MarkDownEditor */}
                  <Controller
                    name="description"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MarkDownEditor
                        label="" // Bỏ label vì FormLabel của shadcn đã xử lý
                        value={value}
                        // Tạo hàm mới để khớp với cấu trúc `changeValue` của bạn
                        changeValue={(newValueCallback) => {
                          // `newValueCallback` là một hàm (prev => ({...prev, [name]: content}))
                          // Chúng ta chỉ cần lấy content mới và gọi hàm `onChange` của RHF
                          const newContent = newValueCallback(null)[field.name];
                          onChange(newContent);
                        }}
                        name="description" // Vẫn cần prop `name` này
                        height={400} // Đặt chiều cao mong muốn cho editor
                      />
                    )}
                  />
                </FormControl>
                {/* FormMessage của shadcn/ui sẽ tự động hiển thị lỗi từ zod */}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFormStep1;
