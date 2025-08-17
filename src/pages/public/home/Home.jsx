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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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
      <NewLetter />
    </div>
  );
};

export default Home;
