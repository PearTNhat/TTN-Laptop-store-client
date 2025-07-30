// src/pages/ProductManagement/components/ProductDetailFields.jsx

import React, { useState, useEffect } from "react";
import { useFormContext, Controller, useFormState } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Check, ChevronsUpDown, Palette, Settings, Info } from "lucide-react";
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
import { Button } from "~/components/ui/button";

// Giả lập API fetch màu sắc
const fetchColors = async () => [
  { id: 1, name: "Đen Huyền Bí" },
  { id: 2, name: "Bạc Ánh Trăng" },
  { id: 3, name: "Xám Không Gian" },
];

// Component Combobox cho Màu sắc
const ColorCombobox = ({ control, name, options, isLoading }) => (
  <FormField
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <FormItem className="flex flex-col">
        {/* SỬA LỖI: Bỏ class text-red-500 ở đây */}
        <FormLabel className="font-semibold text-slate-700">Màu sắc</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between font-normal h-10 border-slate-300",
                  !field.value && "text-muted-foreground",
                  error && "border-red-500"
                )}
              >
                {field.value
                  ? options.find((o) => o.value === field.value)?.label
                  : "Chọn màu sắc"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Tìm màu..." />
              <CommandList>
                {isLoading && (
                  <div className="p-2 text-center text-sm">Đang tải...</div>
                )}
                <CommandEmpty>Không tìm thấy màu.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => field.onChange(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          option.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
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

// Component FormField được tùy chỉnh
const StyledFormField = ({ control, name, label, placeholder }) => {
  const { errors } = useFormState({ control, name });
  const hasError = !!errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* SỬA LỖI: Bỏ class text-red-500 ở đây */}
          <FormLabel className="font-semibold text-slate-700">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              // Thêm style cho viền đỏ khi có lỗi, và focus ring
              className={cn(
                "h-10",
                hasError ? "border-red-500" : "border-slate-300",
                "focus:ring-2 focus:ring-blue-300"
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const ProductDetailFields = ({ index }) => {
  const { control } = useFormContext();
  const [colorOptions, setColorOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      setIsLoading(true);
      const colors = await fetchColors();
      setColorOptions(colors.map((c) => ({ value: c.id, label: c.name })));
      setIsLoading(false);
    };
    loadColors();
  }, []);

  const detailPath = `productDetailRequest.${index}`;

  return (
    <div className="space-y-6">
      <Card className="bg-white border-transparent shadow-none">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <Info className="h-5 w-5 text-blue-500" />
            Thông tin phiên bản
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <StyledFormField
            control={control}
            name={`${detailPath}.title`}
            label="Tên phiên bản"
            placeholder="VD: Laptop Dell Vostro 15 (Core i5, 8GB, 256GB)"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.slug`}
            label="Slug"
            placeholder="VD: laptop-dell-vostro-15-i5"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.originalPrice`}
            label="Giá gốc"
            placeholder="0"
          />
          <ColorCombobox
            control={control}
            name={`${detailPath}.colorId`}
            options={colorOptions}
            isLoading={isLoading}
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.thumbnail`}
            label="Ảnh đại diện (URL)"
            placeholder="https://..."
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.images.0`}
            label="Ảnh chi tiết 1 (URL)"
            placeholder="https://..."
          />
        </CardContent>
      </Card>

      <Card className="bg-white border-transparent shadow-none">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <Settings className="h-5 w-5 text-purple-500" />
            Cấu hình chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.cpu`}
            label="CPU"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.ram`}
            label="RAM"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.hardDrive`}
            label="Ổ cứng"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.graphicCard`}
            label="Card đồ họa"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.displaySize`}
            label="Màn hình"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailFields;
