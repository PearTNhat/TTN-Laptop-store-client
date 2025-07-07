import React from "react";
import Carousel from "./components/Carousel";
import CategoryCarousel from "./components/CategoryCarousel";
import ProductCarousel from "./components/ProductCarousel";
import BrandCarousel from "./components/BrandCarousel";
import PromotionBanner from "./components/PromotionBanner";
import NewLetter from "./components/NewLetter";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Carousel />
      </div>
      <CategoryCarousel />
      <BrandCarousel />
      <div className="bg-white py-4">
        <ProductCarousel title="🔥 Sản phẩm bán chạy" limit={8} />
      </div>
      <PromotionBanner />
      <div className="bg-gradient-to-br from-red-50 to-pink-50 py-4">
        <ProductCarousel title="⚡ Sản phẩm khuyến mãi" limit={8} />
      </div>
      <div className="bg-white py-4">
        <ProductCarousel title="✨ Sản phẩm mới nhất" limit={8} />
      </div>
      <NewLetter />
    </div>
  );
};

export default Home;
