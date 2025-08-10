import React, { useEffect, useState } from "react";
import { apiGetProducts } from "~/apis/productApi";
import ProductCarousel from "../components/ProductCarousel";

function NewProduct() {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await apiGetProducts({
        page: 1,
        size: 10,
        sortBy: "NEW",
      });
      setProducts(response.data.content);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="bg-white py-4">
      <ProductCarousel title="✨ Sản phẩm mới nhất" products={products} />
    </div>
  );
}

export default NewProduct;
