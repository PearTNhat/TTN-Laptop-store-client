import React from "react";
import { FaSearch, FaBox } from "react-icons/fa";
import { formatPrice } from "~/utils/helper";

const ProductSelectionForm = ({
  products,
  selectedProducts,
  productSearch,
  productLoading,
  onProductSearch,
  onToggleProductSelection,
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
        <FaBox />
        Chọn sản phẩm áp dụng
      </h3>

      {/* Search input */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={productSearch}
          onChange={onProductSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="Tìm kiếm sản phẩm..."
        />
      </div>

      {/* Products list */}
      <div className="border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto bg-white">
        {productLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaBox className="mx-auto mb-3 text-3xl text-gray-300" />
            Không có sản phẩm nào
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedProducts.some((p) => p.id === product.id)}
                  onChange={() => onToggleProductSelection(product.id)}
                  className="mr-4 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />

                <div className="flex items-center space-x-4 flex-1">
                  {/* Product image */}
                  <div className="flex-shrink-0">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center border border-gray-200">
                        <FaBox className="text-green-600 text-lg" />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>ID: {product.id}</span>
                      {product.hex && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: product.hex }}
                            ></div>
                            <div className="">{product.name}</div>
                          </div>
                        </>
                      )}
                    </div>

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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected count */}
      {selectedProducts.length > 0 && (
        <div className="mt-3 text-sm text-green-700 bg-green-100 rounded-md p-2">
          ✅ Đã chọn: {selectedProducts.length} sản phẩm
        </div>
      )}
    </div>
  );
};

export default ProductSelectionForm;
