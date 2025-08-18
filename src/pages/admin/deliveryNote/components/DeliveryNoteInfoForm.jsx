// src/pages/DeliveryNoteManagement/components/DeliveryNoteInfoForm.jsx

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FileText, Package } from "lucide-react";
import OrderSelector from "./OrderSelector";

const DeliveryNoteInfoForm = ({ onOrderSelect, preselectedOrder }) => {
  const { control } = useFormContext();
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Thông tin phiếu xuất hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chọn Đơn Hàng */}
          <OrderSelector
            onOrderSelect={onOrderSelect}
            preselectedOrder={preselectedOrder}
          />

          {/* Trạng thái */}
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-600" />
                  Trạng thái
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* <SelectItem value="DRAFT">Bản nháp</SelectItem> */}
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
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
                  placeholder="Thêm ghi chú cho phiếu xuất (không bắt buộc)..."
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
