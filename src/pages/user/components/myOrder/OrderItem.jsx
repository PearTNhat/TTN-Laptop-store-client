import React, { useState } from "react";
import {
  FiCalendar,
  FiInfo,
  FiShoppingCart,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import { formatPrice, formatDate } from "~/utils/helper";

const OrderItem = ({ order, onDetail, onBuyAgain }) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const [zoomImage, setZoomImage] = useState(null);

  const renderStatusIcon = () => {
    if (order.status === "Hoàn thành") {
      return <FiPackage className="text-green-500 text-md" />;
    }
    if (order.status === "Đang giao") {
      return <FiTruck className="text-blue-400 text-md" />;
    }
    return <FiInfo className="text-yellow-400 text-md" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow mb-6 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border-b border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white shadow-sm">
              {renderStatusIcon()}
            </div>
            <div>
              <p className="text-xs text-gray-500">Mã đơn hàng</p>
              <p className="font-bold text-gray-800 text-lg">{order.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusBadge}`}
            >
              {order.status}
            </span>
            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar className="text-gray-500" />
              <span className="text-sm">{formatDate(order.date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Body */}
      <div className="p-5">
        <div className="space-y-6">
          {/* Products List */}
          <div className="space-y-4">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* <Link href={`/product/${item.productId}`}>
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-lg border hover:scale-105 transition"
                  />
                </Link> */}
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-16 h-16">
                  <div
                    className="relative flex-shrink-0 w-16 h-16 cursor-pointer"
                    onClick={() => setZoomImage(item.thumbnail)}
                  >
                    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Optional Zoom Icon */}
                  <div className="absolute top-0 right-0 bg-white rounded-bl-md px-1 py-0.5 text-[10px] text-gray-500 shadow-sm hidden group-hover:block">
                    Zoom
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-gray-800 text-sm line-clamp-2"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {order.items.length > 4 && (
              <p className="text-sm text-gray-500">
                +{order.items.length - 4} sản phẩm khác
              </p>
            )}
          </div>
          {/* {zoomImage && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
              onClick={() => setZoomImage(null)}
            >
              <div
                className="bg-white p-4 rounded-xl shadow-xl w-[100px] sm:w-[150px] relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                  onClick={() => setZoomImage(null)}
                >
                  ✕
                </button>
                <img
                  src={zoomImage}
                  alt="Zoomed"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          )} */}
          {/* Summary + Actions */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-200 rounded-xl p-5">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Giá sản phẩm:</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-800">
                  Tổng cộng:
                </span>
                <span className="text-xl font-bold text-orange-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onDetail(order)}
                className="flex-1 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-100 transition-colors text-gray-700 font-medium flex items-center justify-center gap-2"
              >
                <FiInfo /> Xem đơn hàng
              </button>
              {order.status === "Hoàn thành" && (
                <button
                  onClick={() => onBuyAgain(order)}
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-md"
                >
                  <FiShoppingCart /> Đặt lại đơn này
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
