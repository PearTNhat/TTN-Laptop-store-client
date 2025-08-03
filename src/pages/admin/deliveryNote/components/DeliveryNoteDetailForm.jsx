// src/pages/DeliveryNoteManagement/components/DeliveryNoteDetailForm.jsx

import React, { useEffect } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PlusCircle, Trash2, Package2, Hash } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "~/components/ui/form";

// Component con cho mỗi dòng sản phẩm trong form
const ProductRow = ({ index, remove }) => {
  const { control, setValue, getValues } = useFormContext();
  const quantity = useWatch({ control, name: `details.${index}.quantity` });
  const productDetailId = useWatch({
    control,
    name: `details.${index}.productDetailId`,
  });

  // Hàm tạo serial number tự động
  const generateSerialNumber = (productId, index) => {
    const timestamp = Date.now().toString().slice(-6); // 6 số cuối của timestamp
    const productPrefix = productId ? `P${productId}` : "P000";
    return `${productPrefix}-${timestamp}-${(index + 1)
      .toString()
      .padStart(3, "0")}`;
  };

  // Tự động tạo serial number khi số lượng thay đổi
  useEffect(() => {
    const currentSerials = getValues(`details.${index}.serialNumbers`) || [];
    const newQuantity = parseInt(quantity, 10) || 0;

    if (newQuantity > 0 && currentSerials.length !== newQuantity) {
      const newSerialsArray = Array(newQuantity)
        .fill("")
        .map((_, i) => {
          // Nếu đã có serial number thì giữ nguyên, nếu không thì tạo mới
          return currentSerials[i] || generateSerialNumber(productDetailId, i);
        });
      setValue(`details.${index}.serialNumbers`, newSerialsArray);
    } else if (newQuantity === 0) {
      setValue(`details.${index}.serialNumbers`, []);
    }
  }, [quantity, productDetailId, index, setValue, getValues]);

  const serialNumbers =
    useWatch({ control, name: `details.${index}.serialNumbers` }) || [];

  return (
    <TableRow className="hover:bg-gray-50">
      {/* Nhập ID sản phẩm */}
      <TableCell style={{ minWidth: "200px" }}>
        <FormField
          control={control}
          name={`details.${index}.productDetailId`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Nhập ID sản phẩm..."
                  type="number"
                  {...field}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
      </TableCell>

      {/* Nhập số lượng */}
      <TableCell>
        <FormField
          control={control}
          name={`details.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  className="w-24 text-center border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
      </TableCell>

      {/* Hiển thị Serial Numbers tự động */}
      <TableCell style={{ minWidth: "320px" }}>
        <div className="space-y-2">
          {serialNumbers.length > 0 ? (
            <>
              {serialNumbers.map((serialValue, snIndex) => (
                <div key={snIndex} className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-green-500" />
                  <div className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-700">
                    {serialValue}
                  </div>
                  <span className="text-xs text-gray-500">#{snIndex + 1}</span>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newSerials = Array(serialNumbers.length)
                    .fill("")
                    .map((_, i) => generateSerialNumber(productDetailId, i));
                  setValue(`details.${index}.serialNumbers`, newSerials);
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                🔄 Tái tạo Serial
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Hash className="h-4 w-4" />
              <p>Nhập số lượng để tự động tạo serial</p>
            </div>
          )}
        </div>
      </TableCell>

      {/* Nút xóa dòng */}
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => remove(index)}
          className="hover:bg-red-100 text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

// Component chính quản lý bảng chi tiết
const DeliveryNoteDetailForm = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const addProduct = () => {
    append({
      productDetailId: undefined,
      quantity: 1,
      serialNumbers: [], // Sẽ được tự động tạo khi có quantity
    });
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <Package2 className="h-5 w-5 text-green-600" />
          Chi tiết Sản phẩm Giao
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {fields.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Package2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-gray-500 mb-4">
              Thêm sản phẩm đầu tiên vào phiếu giao hàng
            </p>
            <Button
              type="button"
              onClick={addProduct}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm sản phẩm đầu tiên
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    ID Sản phẩm
                    <span className="text-red-500 ml-1">*</span>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Số lượng
                    <span className="text-red-500 ml-1">*</span>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Serial Numbers (Tự động tạo)
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <ProductRow key={field.id} index={index} remove={remove} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {fields.length > 0 && (
        <CardFooter className="justify-start border-t pt-4 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={addProduct}
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm khác
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DeliveryNoteDetailForm;
