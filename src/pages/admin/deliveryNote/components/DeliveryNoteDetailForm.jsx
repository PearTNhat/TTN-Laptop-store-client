// src/pages/DeliveryNoteManagement/components/DeliveryNoteDetailForm.jsx

import React, { useEffect, useState, useCallback, use } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PlusCircle, Trash2, Package2, Hash } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { apiGetOrderDetail } from "~/apis/orderApi";
import { apiGetSeriesNumberByPid } from "~/apis/inventoryApi";
import { showToastError } from "~/utils/alert";

// Component con cho mỗi dòng sản phẩm
const ProductRow = ({ index, remove, orderProducts }) => {
  const { control, setValue, watch } = useFormContext();
  const { accessToken } = useSelector((state) => state.user);
  const [serialOptions, setSerialOptions] = useState([]);
  const [loadingSerials, setLoadingSerials] = useState(false);
  const productDetailId = watch(`details.${index}.productDetailId`);
  const quantity = watch(`details.${index}.quantity`);
  const selectedSerials = watch(`details.${index}.serialProductItemId`) || [];
  // Tìm sản phẩm đã chọn từ danh sách order
  const selectedProduct = orderProducts.find(
    (p) => p.productDetailId == productDetailId
  );
  const maxQuantity = selectedProduct ? selectedProduct.quantity : 0;
  // Load serial numbers khi chọn sản phẩm
  const loadSerialNumbers = useCallback(
    async (pid) => {
      if (!pid) return;

      setLoadingSerials(true);
      try {
        const response = await apiGetSeriesNumberByPid({
          accessToken,
          pId: pid,
        });
        if (response.code === 200) {
          setSerialOptions(response.data || []);
        } else {
          showToastError(response.message || "Lỗi khi tải serial numbers");
          setSerialOptions([]);
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi tải serial numbers");
        setSerialOptions([]);
      } finally {
        setLoadingSerials(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (productDetailId) {
      loadSerialNumbers(productDetailId);
      setValue(`details.${index}.quantity`, 1);
      setValue(`details.${index}.serialProductItemId`, []);
    }
  }, [productDetailId, loadSerialNumbers, setValue, index]);

  // Tự động điều chỉnh serial khi thay đổi số lượng
  useEffect(() => {
    const currentSelectedSerials =
      watch(`details.${index}.serialProductItemId`) || [];
    if (quantity && currentSelectedSerials.length !== quantity) {
      const newSerials = currentSelectedSerials.slice(0, quantity);
      setValue(`details.${index}.serialProductItemId`, newSerials);
    }
  }, [quantity, setValue, index, watch]);

  // Xử lý thay đổi serial number
  const handleSerialChange = (serialIndex, serialValue) => {
    const newSerials = [...selectedSerials];
    newSerials[serialIndex] = serialValue;
    setValue(`details.${index}.serialProductItemId`, newSerials);
  };

  return (
    <TableRow className="hover:bg-gray-50">
      {/* Chọn sản phẩm từ order */}
      <TableCell style={{ minWidth: "300px" }}>
        <FormField
          control={control}
          name={`details.${index}.productDetailId`}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Chọn sản phẩm..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {orderProducts.map((product) => (
                    <SelectItem
                      key={product.productDetailId}
                      value={product.productDetailId.toString()}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {product.productTitle}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {product.productDetailId} | Có thể giao:{" "}
                          {product.quantity}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  max={maxQuantity}
                  {...field}
                  className="w-24 text-center border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Tối đa: {maxQuantity}
              </p>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
      </TableCell>

      {/* Chọn Serial Numbers */}
      <TableCell style={{ minWidth: "400px" }}>
        <div className="space-y-2">
          {loadingSerials ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-gray-600">
                Đang tải serials...
              </span>
            </div>
          ) : quantity > 0 && serialOptions.length > 0 ? (
            Array.from(
              { length: parseInt(quantity, 10) || 0 },
              (_, serialIndex) => (
                <div key={serialIndex} className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-green-500" />
                  <Select
                    value={selectedSerials[serialIndex] || ""}
                    onValueChange={(value) =>
                      handleSerialChange(serialIndex, value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue
                        placeholder={`Chọn serial ${serialIndex + 1}...`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {serialOptions.map((serial) => {
                        return (
                          <SelectItem key={serial} value={serial}>
                            <div className="flex flex-col">
                              <span className="font-mono">{serial}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-gray-500">
                    #{serialIndex + 1}
                  </span>
                </div>
              )
            )
          ) : productDetailId &&
            serialOptions.length === 0 &&
            !loadingSerials ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
              <Hash className="h-4 w-4" />
              <p>Không có serial number khả dụng</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
              <Hash className="h-4 w-4" />
              <p>Chọn sản phẩm và nhập số lượng để chọn serial</p>
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
const DeliveryNoteDetailForm = ({ selectedOrder }) => {
  const { control } = useFormContext();
  const { accessToken } = useSelector((state) => state.user);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  // Load chi tiết đơn hàng khi chọn order
  const loadOrderDetail = useCallback(
    async (orderId) => {
      setLoadingOrderDetail(true);
      try {
        const response = await apiGetOrderDetail({
          accessToken,
          id: orderId,
        });

        if (response.code === 200) {
          setOrderProducts(response.data.orderDetails || []);
        } else {
          showToastError(response.message || "Lỗi khi tải chi tiết đơn hàng");
          setOrderProducts([]);
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi tải chi tiết đơn hàng");
        setOrderProducts([]);
      } finally {
        setLoadingOrderDetail(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (selectedOrder?.id) {
      loadOrderDetail(selectedOrder.id);
    } else {
      setOrderProducts([]);
    }
  }, [selectedOrder, loadOrderDetail]);

  const addProduct = () => {
    append({
      productDetailId: "",
      quantity: 1,
      serials: [],
    });
  };
  const canAddMoreProducts = fields.length < orderProducts.length;
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <Package2 className="h-5 w-5 text-green-600" />
          Chi tiết Sản phẩm Giao
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!selectedOrder ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Package2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa chọn đơn hàng
            </h3>
            <p className="text-gray-500 mb-4">
              Vui lòng chọn đơn hàng trước khi thêm sản phẩm
            </p>
          </div>
        ) : loadingOrderDetail ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        ) : orderProducts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Package2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Đơn hàng trống
            </h3>
            <p className="text-gray-500 mb-4">
              Đơn hàng này không có sản phẩm nào
            </p>
          </div>
        ) : fields.length === 0 ? (
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
                    Sản phẩm
                    <span className="text-red-500 ml-1">*</span>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Số lượng
                    <span className="text-red-500 ml-1">*</span>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Serial Numbers
                    <span className="text-red-500 ml-1">*</span>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <ProductRow
                    key={field.id}
                    index={index}
                    remove={remove}
                    orderProducts={orderProducts}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {selectedOrder && orderProducts.length > 0 && fields.length > 0 && (
        <CardFooter className="justify-start border-t pt-4 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={addProduct}
            disabled={!canAddMoreProducts} // Vô hiệu hóa nút khi không thể thêm
            className="border-green-300 text-green-700 hover:bg-green-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm khác
          </Button>
          {!canAddMoreProducts && (
            <p className="text-sm text-gray-500 ml-4">
              Đã thêm tất cả sản phẩm trong đơn hàng.
            </p>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default DeliveryNoteDetailForm;
