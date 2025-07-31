// src/pages/ProductManagement/components/ProductDetailFields.jsx

import React, { useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Settings, Info, Image as ImageIcon } from "lucide-react";
import ImageUploader from "../ImageUploader";
import StyledFormField from "~/components/formFiled/StyledFormField";
// import ColorCombobox from './ColorCombobox'; // Import component chọn màu mới
import { generateSlug } from "~/utils/helper";
import BaseCombobox from "~/components/formFiled/BaseCombobox";
import { FormField } from "~/components/ui/form";

const ProductDetailFields = ({ index, colorsOptions }) => {
  const { control, setValue, getValues } = useFormContext();
  const detailPath = `productDetailRequest.${index}`;

  const titleValue = useWatch({ control, name: `${detailPath}.title` });

  // Effect để tự động cập nhật slug khi title thay đổi
  useEffect(() => {
    if (titleValue) {
      const newSlug = generateSlug(titleValue);
      setValue(`${detailPath}.slug`, newSlug, { shouldValidate: true });
    }
  }, [titleValue, setValue, getValues, detailPath]);

  // Hàm được gọi mỗi khi danh sách ảnh thay đổi từ ImageUploader
  const handleImagesChange = (imageUrls) => {
    setValue(`${detailPath}.images`, imageUrls, { shouldValidate: true });
    // Tự động cập nhật trường 'thumbnail' bằng ảnh đầu tiên
    setValue(`${detailPath}.thumbnail`, imageUrls[0] || "", {
      shouldValidate: true,
    });
  };
  const renderColorOption = (option) => (
    <div className="flex items-center gap-2">
      {option.hex && (
        <span
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: option.hex }}
        ></span>
      )}
      <span>{option.label}</span>
    </div>
  );
  return (
    <div className="space-y-6">
      {/* CARD THÔNG TIN CƠ BẢN */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <Info className="h-5 w-5 text-blue-500" />
            Thông tin phiên bản
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <StyledFormField
            control={control}
            name={`${detailPath}.title`}
            label="Tên phiên bản"
            placeholder="VD: Laptop Dell Vostro 15..."
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.slug`}
            label="Slug (URL thân thiện)"
            placeholder="Sẽ được tự động tạo..."
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.originalPrice`}
            label="Giá gốc"
            placeholder="0"
            type="number"
          />

          {/* SỬ DỤNG COMPONENT MỚI Ở ĐÂY */}
          <BaseCombobox
            name={`${detailPath}.colorId`}
            label="Màu sắc"
            placeholder="Chọn màu sắc"
            options={colorsOptions}
            renderOption={renderColorOption}
            renderValue={renderColorOption} // Dùng chung hàm render
          />

          <StyledFormField
            control={control}
            name={`${detailPath}.warrantyProd`}
            label="Bảo hành"
            placeholder="VD: 12 tháng"
          />
        </CardContent>
      </Card>

      {/* CARD UPLOAD ẢNH (Đã được đơn giản hóa) */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <ImageIcon className="h-5 w-5 text-green-500" />
            Hình ảnh sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name={`${detailPath}.images`}
            control={control}
            render={({ field }) => (
              <ImageUploader
                label="Tải lên tối đa 5 ảnh (ảnh đầu tiên sẽ là ảnh đại diện)"
                maxFiles={5}
                value={field.value}
                onChange={handleImagesChange}
              />
            )}
          />
          {/* Trường thumbnail ẩn */}
          <FormField
            control={control}
            name={`${detailPath}.thumbnail`}
            render={() => <></>}
          />
        </CardContent>
      </Card>

      {/* CARD CẤU HÌNH CHI TIẾT */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <Settings className="h-5 w-5 text-purple-500" />
            Cấu hình chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.cpu`}
            defaultValue="Intel Core i5"
            label="CPU"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.ram`}
            defaultValue="8GB DDR4"
            label="RAM"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.hardDrive`}
            defaultValue="512GB SSD"
            label="Ổ cứng"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.graphicCard`}
            defaultValue="NVIDIA GeForce GTX 1650"
            label="Card đồ họa"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.displaySize`}
            defaultValue="15.6 inch"
            label="Màn hình"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.weight`}
            label="Cân nặng"
            defaultValue="1.5 kg"
            placeholder="VD: 2.1 kg"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.madeIn`}
            defaultValue="Việt Nam"
            label="Sản xuất tại"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.ramValue`}
            label="Giá trị RAM"
            defaultValue="8GB"
            placeholder="VD: 8GB"
          />
          <StyledFormField
            slug
            for
            control={control}
            name={`${detailPath}.configRequest.hardDriveValue`}
            label="Giá trị Ổ cứng"
            defaultValue="512GB"
            placeholder="VD: 512GB"
          />
          <StyledFormField
            control={control}
            name={`${detailPath}.configRequest.nameConfig`}
            defaultValue="demo"
            label="Tên cấu hình"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailFields;
