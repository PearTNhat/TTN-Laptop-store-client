import React from "react";
import { FaTimes, FaUser, FaBox, FaStar, FaCrown, FaGem } from "react-icons/fa";
import { formatPrice } from "~/utils/helper";

const SelectedItemsDisplay = ({
  type,
  selectedUsers = [],
  selectedProducts = [],
  selectedRanks = [],
  onRemoveUser,
  onRemoveProduct,
  onRemoveRank,
  onClearAll,
}) => {
  const getRankIcon = (priority) => {
    switch (priority) {
      case 1:
        return <FaUser className="text-gray-600" />;
      case 2:
        return <FaStar className="text-blue-600" />;
      case 3:
        return <FaCrown className="text-yellow-600" />;
      case 4:
        return <FaGem className="text-purple-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  if (
    (type === "USER_PROMOTION" &&
      selectedUsers.length === 0 &&
      selectedRanks.length === 0) ||
    (type === "PRODUCT_DISCOUNT" && selectedProducts.length === 0) ||
    (type === "GIFT" && selectedRanks.length === 0)
  ) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {type === "USER_PROMOTION" ? (
            <>
              <FaUser className="text-blue-600" />
              Người dùng đã chọn
            </>
          ) : (
            <>
              <FaBox className="text-green-600" />
              Sản phẩm đã chọn
            </>
          )}
        </h4>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto bg-white">
        {type === "USER_PROMOTION" && selectedUsers.length > 0 && (
          <div className="space-y-3">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                        <FaUser className="text-blue-600 text-sm" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-blue-600">ID: {user.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveUser(user.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}

        {type === "PRODUCT_DISCOUNT" && selectedProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-100 hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-green-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center">
                        <FaBox className="text-green-600 text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-green-600 mt-1">
                      <span>ID: {product.id}</span>
                      {product.hex && (
                        <div className="flex items-center space-x-1">
                          <span>•</span>
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: product.hex }}
                          ></div>
                        </div>
                      )}
                    </div>
                    {product.title && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {product.title}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 text-xs mt-1">
                      {product.discountPrice &&
                      product.discountPrice !== product.originalPrice ? (
                        <>
                          <span className="text-red-600 font-medium">
                            {formatPrice(product.discountPrice)}
                          </span>
                          <span className="text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors ml-2"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hiển thị ranks đã chọn */}
        {(type === "USER_PROMOTION" || type === "GIFT") &&
          selectedRanks.length > 0 && (
            <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaCrown className="text-yellow-600" />
                Hạng khách hàng đã chọn
              </h5>
              {selectedRanks.map((rank) => (
                <div
                  key={rank.id}
                  className="flex items-center justify-between bg-yellow-50 rounded-lg p-3 border border-yellow-100 hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getRankIcon(rank.priority)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {rank.name}
                        </p>
                        <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                          Mức {rank.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {rank.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        Chi tiêu tối thiểu: {formatPrice(rank.minSpending)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveRank(rank.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors ml-2"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {type === "USER_PROMOTION" &&
              selectedUsers.length > 0 &&
              `${selectedUsers.length} người dùng đã chọn`}
            {type === "USER_PROMOTION" &&
              selectedRanks.length > 0 &&
              selectedUsers.length === 0 &&
              `${selectedRanks.length} hạng đã chọn`}
            {type === "PRODUCT_DISCOUNT" &&
              `${selectedProducts.length} sản phẩm đã chọn`}
            {type === "GIFT" && `${selectedRanks.length} hạng đã chọn`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectedItemsDisplay;
