import React from "react";
import ItemStatusBadge from "./ItemStatusBadge";

const OrderItemCard = ({ item, onUpdateItemStatus, editable = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.productImage || "/images/default-product.png"}
            alt={item.productName}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.src = "/images/default-product.png";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 truncate">
            {item.productName}
          </h4>

          {/* Product Specifications */}
          {item.specifications && (
            <div className="mt-2 space-y-1">
              {Object.entries(item.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <span className="font-medium capitalize">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quantity and Price */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Số lượng: <span className="text-blue-600">{item.quantity}</span>
              </span>
              <span className="text-sm font-medium text-gray-700">
                Đơn giá:{" "}
                <span className="text-green-600">
                  {formatPrice(item.price)}
                </span>
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>

          {/* Item Status */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Trạng thái:
              </span>
              <ItemStatusBadge
                status={item.status}
                editable={editable}
                onClick={() => editable && onUpdateItemStatus?.(item)}
              />
            </div>

            {/* Item Notes */}
            {item.notes && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 italic">
                  Ghi chú: {item.notes}
                </span>
              </div>
            )}
          </div>

          {/* Item History */}
          {item.history && item.history.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                  Lịch sử cập nhật ({item.history.length})
                </summary>
                <div className="mt-2 space-y-2 pl-4">
                  {item.history.map((entry, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <span className="font-medium">{entry.action}</span>
                      {entry.by && <span> bởi {entry.by}</span>}
                      <span className="text-gray-400">
                        {" "}
                        - {new Date(entry.timestamp).toLocaleString("vi-VN")}
                      </span>
                      {entry.note && (
                        <div className="italic mt-1">"{entry.note}"</div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
