// src/pages/PurchaseOrderManagement/components/PurchaseOrderInfoForm.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import BaseCombobox from "~/components/formFiled/BaseCombobox"; // Dùng lại BaseCombobox
import { Textarea } from "~/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const PurchaseOrderInfoForm = ({ suppliers }) => {
  // Chuyển đổi dữ liệu suppliers để BaseCombobox có thể sử dụng
  const { control } = useFormContext(); // Lấy control
  const supplierOptions = suppliers.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Thông tin Đơn Hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trường chọn nhà cung cấp */}
        <BaseCombobox
          name="supplierId"
          label="Nhà cung cấp"
          placeholder="Chọn nhà cung cấp..."
          options={supplierOptions}
        />
        {/* Trường ghi chú */}
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Thêm ghi chú cho đơn hàng (không bắt buộc)..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderInfoForm;
