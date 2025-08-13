// src/pages/admin/deliveryNote/components/OrderSelector.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Search, Package2, Calendar, User, Check } from "lucide-react";
import { apiGetOrderList } from "~/apis/orderApi";
import { showToastError } from "~/utils/alert";

const OrderSelector = ({ onOrderSelect, preselectedOrder }) => {
  const { control, setValue, watch } = useFormContext();
  const { accessToken } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const orderCode = watch("orderCode");

  const fetchOrders = useCallback(
    async ({ keyword = "" } = {}) => {
      setLoading(true);
      try {
        console.log("Fetching orders with keyword:", keyword);
        const response = await apiGetOrderList({
          accessToken,
          params: {
            page: 1,
            size: 30,
            status: "PROCESSING",
            code: keyword,
          },
        });
        if (response.code === 200) {
          setOrders(response.data.content || []);
        } else {
          showToastError(response.message || "Lỗi khi tải danh sách đơn hàng");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );
  useEffect(() => {
    if (isOpen) {
      fetchOrders({ keyword: searchTerm });
    }
  }, [isOpen, searchTerm, fetchOrders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && isOpen) {
        fetchOrders({ keyword: searchTerm });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, fetchOrders]);

  const handleSelectOrder = (order) => {
    setValue("orderCode", order.code);
    setIsOpen(false);
    onOrderSelect(order);
  };

  return (
    <FormField
      control={control}
      name="orderCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package2 className="h-4 w-4 text-green-600" />
            Chọn Đơn Hàng
            <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <Input
                placeholder={
                  preselectedOrder
                    ? `${preselectedOrder.code} - ${
                        preselectedOrder.customerName || "N/A"
                      }`
                    : "Chưa chọn đơn hàng"
                }
                {...field}
                readOnly
                className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500 cursor-pointer"
                onClick={() => !preselectedOrder && setIsOpen(true)}
                disabled={!!preselectedOrder}
              />
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                    disabled={!!preselectedOrder}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {preselectedOrder ? "Đã chọn" : "Chọn"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Package2 className="h-5 w-5 text-green-600" />
                      Chọn Đơn Hàng
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm theo mã đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Order List */}
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Package2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Không tìm thấy đơn hàng</p>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div
                            key={order.id}
                            onClick={() => handleSelectOrder(order)}
                            className={`p-4 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${
                              orderCode === order.code
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Mã Đơn Hàng
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                      {order.code}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Ngày Tạo
                                    </p>
                                    <p className="text-sm text-gray-700 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        order.createdDate
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Khách Hàng
                                    </p>
                                    <p className="text-sm text-gray-700 flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {order.customerName || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                {order.note && (
                                  <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                    {order.note}
                                  </p>
                                )}
                              </div>
                              {orderCode === order.code && (
                                <Check className="h-5 w-5 text-green-600 ml-2" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </FormControl>

          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )}
    />
  );
};

export default OrderSelector;
