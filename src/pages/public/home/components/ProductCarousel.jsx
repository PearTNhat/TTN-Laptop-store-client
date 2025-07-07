import React from "react";
import CustomSliceProducts from "~/components/customeSlice/CustomSliceProducts";
import {
  getHotProducts,
  getNewProducts,
  getPromotionProducts,
  getTopRatedProducts,
} from "~/data/fakeData";

// Component có thể nhận type để hiển thị các loại sản phẩm khác nhau
const ProductCarousel = ({ title, type = "hot", limit = 8 }) => {
  // Lấy sản phẩm theo type
  const getProductsByType = () => {
    switch (type) {
      case "hot":
        return getHotProducts(limit);
      case "new":
        return getNewProducts(limit);
      case "promotion":
        return getPromotionProducts(limit);
      case "topRated":
        return getTopRatedProducts(limit);
      default:
        return getHotProducts(limit);
    }
  };

  const products = getProductsByType();

  const defaultSettings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    slidesToScroll: 1,
    dots: false,
  };

  return (
    <div className="mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <CustomSliceProducts
          products={products}
          loading={false}
          customSetting={defaultSettings}
        />
      </div>
    </div>
  );
};

export default ProductCarousel;
