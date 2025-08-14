import React from "react";
import Carousel from "./components/Carousel";
import CategoryCarousel from "./components/CategoryCarousel";
import BrandCarousel from "./components/BrandCarousel";
import PromotionBanner from "./components/PromotionBanner";
import NewLetter from "./components/NewLetter";
import HotProduct from "./hotProduct/HotProduct";
import NewProduct from "./newProduct/NewProduct";
import HotRating from "./hotRating/HotRating";

const Home = () => {
  return (
    <div className="mx-auto min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Carousel */}
      <div className="mx-auto px-2 pt-8">
        <Carousel />
      </div>
      <CategoryCarousel />
      <HotProduct />
      <NewProduct />
      <HotRating />
      <BrandCarousel />
      <PromotionBanner />
      {/* <div className="bg-gradient-to-br from-red-50 to-pink-50 py-4">
        <ProductCarousel
          title="⚡ Sản phẩm khuyến mãi"
          type="promotion"
          limit={8}
        />
      </div> */}

      <NewLetter />
    </div>
  );
};

export default Home;
