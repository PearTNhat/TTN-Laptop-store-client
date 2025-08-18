import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiInfo,
  FiPackage,
  FiTruck,
  FiChevronRight,
} from "react-icons/fi";
import { formatPrice, formatDate } from "~/utils/helper";
import { useSelector } from "react-redux";
import { apiChangeStatusOrder } from "~/apis/orderApi";

const OrderItem = ({ order, onDetail, onStatusChange }) => {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.user);

  const getDiscountPercent = (originalPrice, price) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };


  const renderStatusInfo = () => {
    if (order.status === "Hoàn thành") {
      return {
        icon: <FiPackage className="text-emerald-500" />,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        ringColor: "ring-emerald-500/10",
      };
    }
    if (order.status === "Đang giao") {
      return {
        icon: <FiTruck className="text-sky-500" />,
        bgColor: "bg-sky-50",
        textColor: "text-sky-600",
        ringColor: "ring-sky-500/10",
      };
    }
    return {
      icon: <FiInfo className="text-amber-500" />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      ringColor: "ring-amber-500/10",
    };
  };

  const statusInfo = renderStatusInfo();

  const handleConfirmComplete = async () => {
    try {
      const res = await apiChangeStatusOrder({
        accessToken,
        id: order.idOrder,
        status: "COMPLETED",
      });

      if (res?.code === 200) {
        // cập nhật UI ngay lập tức
        if (onStatusChange) {
          onStatusChange({ ...order, status: "Hoàn thành" });
        }
      } else {
        alert(res.message || "Xác nhận đơn hàng thất bại");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Tính tổng trước giảm
  const totalBeforeDiscount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:scale-[1.01] transition-transform duration-300 ease-in-out mb-8 group">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${statusInfo.bgColor} ring-4 ${statusInfo.ringColor} transition-all duration-300`}
            >
              {React.cloneElement(statusInfo.icon, {
                className: "w-7 h-7 " + statusInfo.textColor,
              })}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xl tracking-wide">
                #{order.code}
              </p>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <FiCalendar />
                <span>{formatDate(order.date)}</span>
              </div>
            </div>
          </div>

          {/* Badge trạng thái + nút xác nhận (nếu đang giao) */}
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bgColor} ${statusInfo.textColor}`}
            >
              {order.status}
            </span>
            {order.status === "Đang giao" && (
              <button
                onClick={handleConfirmComplete}
                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition duration-200 ease-in-out"
              >
                ✅ Xác nhận đã nhận
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body - Products List */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items.slice(0, 3).map((item) => {
            const discount = getDiscountPercent(item.originalPrice, item.price);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                {/* Left: Thumbnail + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                    onClick={() =>
                      navigate(
                        `/products/${item.idproduct}?pId=${item.idproductDetail}`
                      )
                    }
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <p
                      className="font-semibold text-gray-900 text-base truncate"
                      title={item.name}
                    >
                      {item.name}
                    </p>

                    {/* Giá */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(item.price)}
                      </span>
                      <span className="line-through text-gray-400 text-sm">
                        {formatPrice(item.originalPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Số lượng */}
                    <p className="text-sm text-gray-500 mt-1">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Right: Tổng tiền */}
                <div className="text-right whitespace-nowrap">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Nếu có thêm sản phẩm */}
          {order.items.length > 3 && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500 italic">
                + và {order.items.length - 3} sản phẩm khác...
              </p>
            </div>
          )}
        </div>
      </div>


      {/* Footer - Summary and Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-t border-gray-100 rounded-b-2xl">
        <div className="w-full space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span className="font-medium">{formatPrice(totalBeforeDiscount)}</span>
          </div>
          {order.shopDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Giảm giá cửa hàng:</span>
              <span>-{formatPrice(order.shopDiscount)}</span>
            </div>
          )}
          {order.userDiscount > 0 && (
            <div className="flex justify-between text-sky-600">
              <span>Voucher của bạn:</span>
              <span>-{formatPrice(order.userDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-orange-600 border-t pt-2">
            <span>Tổng cộng:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onDetail(order)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <span>Xem chi tiết</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
