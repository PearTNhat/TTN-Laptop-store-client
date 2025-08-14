import { Calendar, FileText, Package, ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { CardContent, CardHeader, CardTitle, Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  apiGetPurchaseOrders,
  apiGetPurchaseOrderDetail,
} from "~/apis/purchaseOrderApi";
import { showToastError } from "~/utils/alert";
import { formatDate } from "date-fns";

function GoodReceiptInfoForm() {
  const { control, setValue } = useFormContext();
  const { accessToken } = useSelector((state) => state.user);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch danh sách purchase orders có status PENDING
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      setLoading(true);
      try {
        const response = await apiGetPurchaseOrders({
          accessToken,
          page: 1,
          size: 100, // Load tất cả
          statusEnum: "PENDING",
        });

        if (response.code === 200) {
          setPurchaseOrders(response.data.content || []);
        } else {
          showToastError("Không thể tải danh sách đơn hàng");
        }
      } catch (error) {
        showToastError("Lỗi khi tải danh sách đơn hàng");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchPurchaseOrders();
    }
  }, [accessToken]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".purchase-order-dropdown")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelectPurchaseOrder = async (purchaseOrder) => {
    setValue("purchaseOrderCode", purchaseOrder.code);
    setIsOpen(false);

    try {
      // Gọi API để lấy detail của purchase order
      const detailResponse = await apiGetPurchaseOrderDetail({
        accessToken,
        id: purchaseOrder.id,
      });

      if (detailResponse.code === 200) {
        const { details } = detailResponse.data;

        // Map details từ purchase order thành format cho goods receipt
        const detailRequestList = details.map((detail) => ({
          productDetailId: detail.productDetailId, // Tự động điền productDetailId từ purchase order detail
          quantity: detail.quantity,
          unitPrice: detail.unitCost,
          purchaseOrderDetailId: detail.id, // Link với purchase order detail
          serialNumber: [],
          // Thêm thông tin hiển thị
          title: detail.title,
          thumbnail: detail.thumbnail,
        }));

        // Cập nhật danh sách chi tiết trong form
        setValue("detailRequestList", detailRequestList);
      }
    } catch (error) {
      showToastError("Lỗi khi tải chi tiết đơn hàng");
      console.error(error);
    }
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Thông tin Phiếu Xuất Hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trường Mã Đơn Hàng Gốc - Dropdown */}
          <FormField
            control={control}
            name="purchaseOrderCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Mã Đơn Hàng Gốc
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative purchase-order-dropdown">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500 bg-white hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span
                        className={
                          field.value ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {field.value || "Chọn đơn hàng..."}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transform transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {loading ? (
                          <div className="px-3 py-2 text-center text-gray-500">
                            Đang tải...
                          </div>
                        ) : purchaseOrders.length === 0 ? (
                          <div className="px-3 py-2 text-center text-gray-500">
                            Không có đơn hàng PENDING
                          </div>
                        ) : (
                          purchaseOrders.map((order) => (
                            <button
                              key={order.id}
                              type="button"
                              onClick={() => handleSelectPurchaseOrder(order)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">
                                    {order.code}
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    {order.status}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                  📦 {order.supplierName}
                                </span>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>
                                    📅{" "}
                                    {formatDate(
                                      new Date(order.orderDate),
                                      "dd/MM/yyyy"
                                    )}
                                  </span>
                                  <span>📋 SL: {order.totalQuantity}</span>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="receivedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Ngày Nhập Hàng
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  {/* Sử dụng input type="date" cho trải nghiệm người dùng tốt hơn */}
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
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
}

export default GoodReceiptInfoForm;
