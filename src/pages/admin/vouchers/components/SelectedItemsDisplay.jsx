import React from "react";
import { FaTimes, FaUser, FaBox } from "react-icons/fa";
import { formatPrice } from "~/utils/helper";

const SelectedItemsDisplay = ({
  type,
  selectedUsers = [],
  selectedProducts = [],
  onRemoveUser,
  onRemoveProduct,
  onClearAll,
}) => {
  if (type === "USER_PROMOTION" && selectedUsers.length === 0) return null;
  if (type === "PRODUCT_DISCOUNT" && selectedProducts.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          {type === "USER_PROMOTION"
            ? "Người dùng đã chọn"
            : "Sản phẩm đã chọn"}
        </h4>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-red-600 hover:text-red-800"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
        {type === "USER_PROMOTION" && selectedUsers.length > 0 && (
          <div className="space-y-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-blue-600 text-sm" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveUser(user.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {type === "PRODUCT_DISCOUNT" && selectedProducts.length > 0 && (
          <div className="flex gap-2 flex-wrap w-full">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <FaBox className="text-green-600 text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
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
                      <p className="text-xs text-gray-400 truncate">
                        {product.title}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 text-xs">
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
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500 text-center">
          {type === "USER_PROMOTION"
            ? `${selectedUsers.length} người dùng đã chọn`
            : `${selectedProducts.length} sản phẩm đã chọn`}
        </div>
      </div>
    </div>
  );
};

export default SelectedItemsDisplay;
