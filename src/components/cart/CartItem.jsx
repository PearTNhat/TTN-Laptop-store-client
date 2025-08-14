import { Plus, Minus, Trash2, Laptop } from "lucide-react";
import { formatPrice } from "~/utils/helper";
import { Link } from "react-router-dom";
import { showToastWarning } from "~/utils/alert";
const CartItem = ({
  item,
  index,
  isOpen,
  isSelected,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const handleIncreaseQuantity = () => {
    if (item?.appliedPromotion && item?.appliedPromotion.usageLimit) {
      const remainingUses = item.appliedPromotion.usageLimit;
      if (item.quantity >= remainingUses) {
        showToastWarning(
          `Vượt quá giới hạn khuyến mãi! KM sẽ không áp dụng nếu tăng số lượng.`
        );
      }
    }
    // Vẫn gọi update, logic tính giá ở useEffect sẽ xử lý phần còn lại
    onUpdateQuantity(item.productDetailId, item.quantity + 1);
  };
  return (
    <div
      className={`border rounded-lg p-3 transition-all duration-200 shadow-sm hover:shadow-md transform ${
        isSelected
          ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-blue-100"
          : "border-gray-200 hover:border-gray-300 bg-white"
      } ${isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
      style={{
        transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
      }}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) =>
            onSelectItem(item.productDetailId, e.target.checked, {
              finalPrice: item.discountPrice,
            })
          }
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-2 mt-1"
        />
        {/* Product Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
          {item.thumbnail ? (
            <Link
              to={`/products/${item.productId}?pId=${item.productDetailId}`}
              className="block w-full h-full"
            >
              <img
                src={item.itemImage}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </Link>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400 flex items-center justify-center">
              <Laptop className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
            {item.title}
          </h4>

          {/* Color Display */}
          {item?.color?.name && (
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs text-gray-500">Màu:</span>
              <div className="flex items-center space-x-1">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                  style={{
                    backgroundColor: item.color.hex || "#gray",
                  }}
                ></div>
                <span className="text-xs font-medium text-gray-600">
                  {item.color.name}
                </span>
              </div>
            </div>
          )}

          <div className="mb-2">
            {item.originalPrice && item.originalPrice > item.discountPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(item.discountPrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              </div>
            ) : (
              <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(item.originalPrice)}
              </p>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-full p-1">
              <button
                onClick={() =>
                  onUpdateQuantity(item.productDetailId, item.quantity - 1)
                }
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50"
                disabled={item.quantity <= 1}
              >
                <Minus size={12} className="text-gray-600 hover:text-red-500" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-gray-700 bg-white rounded px-2 py-1">
                {item.quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              >
                <Plus
                  size={12}
                  className="text-gray-600 hover:text-green-500"
                />
              </button>
            </div>

            <button
              onClick={() => onRemoveItem(item.productDetailId || item.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Item Total */}
          <div className="mt-2 text-right">
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tổng: {formatPrice(item.discountPrice * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
