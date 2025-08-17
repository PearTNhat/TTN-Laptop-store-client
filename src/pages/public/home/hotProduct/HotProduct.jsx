import React, { useEffect, useState } from "react";
import { apiGetProducts } from "~/apis/productApi";
import ProductCarousel from "../components/ProductCarousel";

function HotProduct() {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await apiGetProducts({
        page: 1,
        size: 10,
        sortBy: "SOLD",
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
    <div className=" bg-white">
      <ProductCarousel title="🔥 Sản phẩm bán chạy" products={products} />
    </div>
  );
}

export default HotProduct;
