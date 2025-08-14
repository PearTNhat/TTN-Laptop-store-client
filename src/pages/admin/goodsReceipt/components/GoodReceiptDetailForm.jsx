// src/pages/DeliveryNoteManagement/components/DeliveryNoteDetailForm.jsx

import React, { useEffect } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  Card,
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
  const { control, setValue, getValues, watch } = useFormContext();
  const quantity = useWatch({
    control,
    name: `detailRequestList.${index}.quantity`,
  });
  const productDetailId = useWatch({
    control,
    name: `detailRequestList.${index}.productDetailId`,
  });

  // Watch thông tin sản phẩm từ purchase order
  const productTitle = watch(`detailRequestList.${index}.title`);
  const productThumbnail = watch(`detailRequestList.${index}.thumbnail`);

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
    const currentSerials =
      getValues(`detailRequestList.${index}.serialNumber`) || [];
    const newQuantity = parseInt(quantity, 10) || 0;

    if (newQuantity > 0 && currentSerials.length !== newQuantity) {
      const newSerialsArray = Array(newQuantity)
        .fill("")
        .map((_, i) => {
          // Nếu đã có serial number thì giữ nguyên, nếu không thì tạo mới
          return currentSerials[i] || generateSerialNumber(productDetailId, i);
        });
      setValue(`detailRequestList.${index}.serialNumber`, newSerialsArray);
    } else if (newQuantity === 0) {
      setValue(`detailRequestList.${index}.serialNumber`, []);
    }
  }, [quantity, productDetailId, index, setValue, getValues]);

  const serialNumbers =
    useWatch({ control, name: `detailRequestList.${index}.serialNumber` }) ||
    [];

  return (
    <TableRow className="hover:bg-gray-50">
      {/* Thông tin sản phẩm */}
      <TableCell style={{ minWidth: "300px" }}>
        <div className="space-y-2">
          {/* Hiển thị thông tin sản phẩm nếu có từ purchase order */}
          {productTitle && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
              {productThumbnail && (
                <img
                  src={productThumbnail}
                  alt={productTitle}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-sm text-green-800">
                  {productTitle}
                </p>
                <p className="text-xs text-green-600">ID: {productDetailId}</p>
              </div>
            </div>
          )}

          {/* Form fields */}
          <FormField
            control={control}
            name={`detailRequestList.${index}.productDetailId`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="ID sản phẩm (tự động điền khi chọn đơn hàng)..."
                    type="number"
                    {...field}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    readOnly={!!productTitle} // Chỉ đọc nếu đã có thông tin từ purchase order
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`detailRequestList.${index}.purchaseOrderDetailId`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="ID Chi tiết ĐH Mua (tự động)..."
                    type="number"
                    {...field}
                    className="text-xs"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TableCell>
      <TableCell>
        <FormField
          control={control}
          name={`detailRequestList.${index}.unitPrice`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  {...field}
                  className="w-32 text-left border-gray-300 focus:border-green-500 focus:ring-green-500"
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
          name={`detailRequestList.${index}.quantity`}
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

      {/* Nhập đơn giá */}

      {/* Hiển thị Serial Numbers tự động */}
      <TableCell style={{ minWidth: "320px" }}>
        <div className="space-y-2">
          {serialNumbers.length > 0 ? (
            serialNumbers.map((_, snIndex) => (
              <FormField
                key={snIndex}
                control={control}
                name={`detailRequestList.${index}.serialNumber.${snIndex}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          #{snIndex + 1}
                        </span>
                        <Input
                          {...field}
                          placeholder={`Serial #${snIndex + 1}`}
                          className="font-mono"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))
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
const GoodReceiptDetailForm = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detailRequestList", // Sửa từ "details" thành "detailRequestList"
  });

  const addProduct = () => {
    append({
      productDetailId: "",
      purchaseOrderDetailId: "",
      quantity: 1,
      unitPrice: 0,
      serialNumber: [], // Sửa tên field cho đúng
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">
                  Thông tin Sản phẩm
                  <span className="text-red-500 ml-1">*</span>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Đơn giá
                  <span className="text-red-500 ml-1">*</span>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Số lượng
                  <span className="text-red-500 ml-1">*</span>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Serial Numbers
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

export default GoodReceiptDetailForm;
