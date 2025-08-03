// src/pages/DeliveryNoteManagement/components/DeliveryNoteInfoForm.jsx

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { FileText, Package } from "lucide-react";

const DeliveryNoteInfoForm = () => {
  const { control } = useFormContext();

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Thông tin Phiếu Giao Hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trường Mã Đơn Hàng Gốc */}
          <FormField
            control={control}
            name="orderCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Mã Đơn Hàng Gốc
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ví dụ: SO-2024-001"
                    {...field}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Trường Ghi Chú */}
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Ghi chú
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Thêm ghi chú cho phiếu giao (không bắt buộc)..."
                  rows={3}
                  {...field}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DeliveryNoteInfoForm;
