import React, { useEffect, useState } from "react";
import { apiGetProducts } from "~/apis/productApi";
import ProductCarousel from "../components/ProductCarousel";

function HotRating() {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await apiGetProducts({
        page: 1,
        size: 10,
        sortBy: "RATING",
        sortDirection: "ASC",
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
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 py-4">
      <ProductCarousel title="⭐ Sản phẩm đánh giá cao" products={products} />
    </div>
  );
}

export default HotRating;
