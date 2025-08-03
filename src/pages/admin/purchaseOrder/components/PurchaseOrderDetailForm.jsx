// src/pages/PurchaseOrderManagement/components/PurchaseOrderDetailForm.jsx

import React from "react";
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
import { PlusCircle, Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "~/components/ui/form";

// Component con cho mỗi dòng sản phẩm - ĐÃ ĐƯỢC XÂY LẠI
const ProductRow = ({ index, remove }) => {
  const { control } = useFormContext();

  return (
    <TableRow>
      {/* Chọn sản phẩm */}
      <TableCell style={{ minWidth: "300px" }}>
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
                />
              </FormControl>
              <FormMessage />
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
