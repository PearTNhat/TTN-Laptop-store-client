// src/pages/ProductManagement/components/ProductFormStep1.jsx

import React, { useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Check, ChevronsUpDown, FileText, LayoutGrid } from "lucide-react";

import { cn } from "~/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

// --- Component Combobox được NÂNG CẤP để hiển thị ảnh ---
const ComboboxField = ({
  control,
  name,
  label,
  placeholder,
  options,
  isLoading,
  disabled = false,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel className="font-semibold text-slate-700">{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                disabled={disabled}
                className={cn(
                  "w-full justify-between font-normal h-10 border-slate-300",
                  !field.value && "text-slate-500",
                  field.value && "bg-blue-50 border-blue-300 text-blue-900",
                  disabled && "bg-slate-100 cursor-not-allowed"
                )}
              >
                {field.value
                  ? options.find((option) => option.value === field.value)
                      ?.label
                  : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput
                placeholder={`Tìm kiếm ${label.toLowerCase()}...`}
              />
              <CommandList>
                {isLoading && (
                  <div className="p-4 text-sm text-center text-slate-500">
                    Đang tải...
                  </div>
                )}
                <CommandEmpty>Không tìm thấy.</CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => field.onChange(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          option.value === field.value
                            ? "opacity-100 text-blue-600"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        {option.image && (
                          <img
                            src={option.image}
                            alt={option.label}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);

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
    setValue("seriesId", undefined, { shouldValidate: true });
  }, [selectedBrandId, brands, setValue]); // <-- Sửa dependency array

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ComboboxField
              control={control}
              name="brandId"
              label="1. Chọn Thương hiệu"
              placeholder="Chọn thương hiệu"
              options={options.brands}
              isLoading={isLoading}
            />
            <ComboboxField
              control={control}
              name="seriesId"
              label="2. Chọn Dòng sản phẩm"
              placeholder="Vui lòng chọn thương hiệu trước"
              options={options.series}
              isLoading={false}
              disabled={!selectedBrandId || options.series.length === 0}
            />
            <ComboboxField
              control={control}
              name="categoryId"
              label="3. Chọn Danh mục"
              placeholder="Chọn danh mục"
              options={options.categories}
              isLoading={isLoading}
            />
          </div>
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
                  <Textarea
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    {...field}
                    rows={5}
                    className="focus:ring-2 focus:ring-blue-300"
                  />
                </FormControl>
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
