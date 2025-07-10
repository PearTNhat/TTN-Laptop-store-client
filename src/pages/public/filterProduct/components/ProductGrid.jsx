import React from "react";
import ProductCard from "~/components/productCard/ProductCard";
import SkeletonLoader from "~/components/productCard/SkeletonProduct";
import { fakeProducts } from "~/data/fakeData";

const ProductGrid = ({
  products = fakeProducts,
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg font-semibold mb-2">
          ⚠️ Có lỗi xảy ra
        </div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <div className="text-xl font-semibold text-gray-700 mb-2">
          Không tìm thấy sản phẩm nào
        </div>
        <div className="text-gray-500">
          Hãy thử điều chỉnh bộ lọc để tìm kiếm sản phẩm phù hợp
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id || product.productId} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
