// src/pages/PurchaseOrderManagement/components/PurchaseOrderDetailForm.jsx

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
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
import { PlusCircle, Trash2, Search, Package, X } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import ProductDetailSelectModal from "./ProductDetailSelectModal";

// Component con cho mỗi dòng sản phẩm
const ProductRow = ({ index, remove }) => {
  const { control, setValue, watch } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Watch product info
  const productDetailId = watch(`details.${index}.productDetailId`);
  const productTitle = watch(`details.${index}.productTitle`);
  const productThumbnail = watch(`details.${index}.productThumbnail`);

  // Handle product selection
  const handleProductSelect = (product) => {
    setValue(`details.${index}.productDetailId`, product.id);
    setValue(`details.${index}.productTitle`, product.title);
    setValue(`details.${index}.productThumbnail`, product.thumbnail);
    setIsModalOpen(false);
  };

  // Handle clear product selection
  const handleClearProduct = () => {
    setValue(`details.${index}.productDetailId`, "");
    setValue(`details.${index}.productTitle`, "");
    setValue(`details.${index}.productThumbnail`, "");
  };

  return (
    <>
      <TableRow>
        {/* Chọn sản phẩm */}
        <TableCell style={{ minWidth: "350px" }}>
          <div className="space-y-2">
            {/* Hiển thị thông tin sản phẩm nếu đã chọn */}
            {productDetailId && productTitle && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                {productThumbnail && (
                  <img
                    src={productThumbnail}
                    alt={productTitle}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm text-blue-800">
                    {productTitle}
                  </p>
                  <p className="text-xs text-blue-600">ID: {productDetailId}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearProduct}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Button chọn sản phẩm */}
            {!productDetailId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="w-full justify-start gap-2"
              >
                <Package className="h-4 w-4" />
                Chọn sản phẩm...
              </Button>
            )}

            {/* Hidden field for form validation */}
            <FormField
              control={control}
              name={`details.${index}.productDetailId`}
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    className="w-24 text-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>

        {/* Nhập đơn giá */}
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.unitCost`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" {...field} className="w-36" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>

        {/* Nút xóa */}
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </TableCell>
      </TableRow>

      {/* Modal chọn sản phẩm */}
      <ProductDetailSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleProductSelect}
        selectedProductId={productDetailId}
      />
    </>
  );
};

// Component chính quản lý danh sách - ĐÃ ĐƯỢC CẬP NHẬT
const PurchaseOrderDetailForm = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details", // **SỬA: Tên mảng là "details"**
  });

  const addProduct = () => {
    append({
      productDetailId: undefined,
      quantity: 1,
      unitCost: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết Sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* **SỬA: Header mới** */}
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
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
      <CardFooter className="justify-start border-t pt-4">
        <Button type="button" variant="outline" onClick={addProduct}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PurchaseOrderDetailForm;
