// src/pages/ProductManagement/components/ProductList.jsx

import React from "react";
import ProductListItem from "./ProductListItem";

const ProductList = ({ products, onDelete, onShowDetails }) => {
  return (
    <div className="space-y-4">
      {products?.map((product) => (
        <ProductListItem
          key={product.id}
          product={product}
          onDelete={onDelete}
          onShowDetails={onShowDetails} // Truyền hàm này xuống
        />
      ))}
    </div>
  );
};

export default ProductList;
