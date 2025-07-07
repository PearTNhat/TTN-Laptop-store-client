import React from "react";
import Carousel from "./components/Carousel";
import CategoryCarousel from "./components/CategoryCarousel";
import ProductCarousel from "./components/ProductCarousel";
import BrandCarousel from "./components/BrandCarousel";
import PromotionBanner from "./components/PromotionBanner";
import NewLetter from "./components/NewLetter";

const Home = () => {
  return (
    <div className="mx-auto min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Carousel */}
      <div className="mx-auto px-2 pt-8">
        <Carousel />
      </div>
      <CategoryCarousel />
      <BrandCarousel />
      <div className="bg-white py-4">
        <ProductCarousel title="🔥 Sản phẩm bán chạy" type="hot" limit={8} />
      </div>
      <PromotionBanner />
      <div className="bg-gradient-to-br from-red-50 to-pink-50 py-4">
        <ProductCarousel
          title="⚡ Sản phẩm khuyến mãi"
          type="promotion"
          limit={8}
        />
      </div>
      <div className="bg-white py-4">
        <ProductCarousel title="✨ Sản phẩm mới nhất" type="new" limit={8} />
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 py-4">
        <ProductCarousel
          title="⭐ Sản phẩm đánh giá cao"
          type="topRated"
          limit={8}
        />
      </div>
      <NewLetter />
    </div>
  );
};

export default Home;
