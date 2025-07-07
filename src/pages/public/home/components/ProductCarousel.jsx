import React from "react";
import CustomSliceProducts from "~/components/customeSlice/CustomSliceProducts";

// Dữ liệu mẫu với thông tin đầy đủ
const sampleProducts = [
  {
    _id: 1,
    name: "MacBook Pro M3 14 inch 2024 - Chip M3 Pro, 18GB RAM, 512GB SSD",
    price: 52990000,
    originalPrice: 62990000,
    rating: 4.8,
    reviewCount: 127,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "macbook-pro-m3-14-inch",
    warranty: 24,
  },
  {
    _id: 2,
    name: "Dell XPS 15 9530 - Intel Core i7, 16GB RAM, 1TB SSD, RTX 4070",
    price: 48990000,
    originalPrice: 58990000,
    rating: 4.6,
    reviewCount: 89,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "dell-xps-15-9530",
    warranty: 12,
  },
  {
    _id: 3,
    name: "ASUS ROG Strix G16 - Intel Core i7, 16GB RAM, 512GB SSD, RTX 4060",
    price: 32990000,
    originalPrice: 38990000,
    rating: 4.7,
    reviewCount: 203,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "asus-rog-strix-g16",
    warranty: 24,
  },
  {
    _id: 4,
    name: "HP Envy x360 13 - AMD Ryzen 7, 16GB RAM, 512GB SSD, Touch Screen",
    price: 21990000,
    originalPrice: 25990000,
    rating: 4.4,
    reviewCount: 156,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "hp-envy-x360-13",
    warranty: 12,
  },
  {
    _id: 5,
    name: "Lenovo ThinkPad X1 Carbon Gen 11 - Intel Core i7, 32GB RAM, 1TB SSD",
    price: 45990000,
    originalPrice: 52990000,
    rating: 4.9,
    reviewCount: 67,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "lenovo-thinkpad-x1-carbon-gen11",
    warranty: 36,
  },
  {
    _id: 6,
    name: "ASUS ZenBook 14 OLED - Intel Core i5, 16GB RAM, 512GB SSD",
    price: 19990000,
    originalPrice: 23990000,
    rating: 4.5,
    reviewCount: 134,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "asus-zenbook-14-oled",
    warranty: 12,
  },
  {
    _id: 7,
    name: "MSI Gaming GF63 Thin - Intel Core i5, 8GB RAM, 512GB SSD, GTX 1650",
    price: 15990000,
    originalPrice: 18990000,
    rating: 4.2,
    reviewCount: 298,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "msi-gaming-gf63-thin",
    warranty: 12,
  },
  {
    _id: 8,
    name: "Acer Swift 3 SF314 - AMD Ryzen 5, 8GB RAM, 256GB SSD, IPS Full HD",
    price: 12990000,
    originalPrice: 15990000,
    rating: 4.3,
    reviewCount: 187,
    imageUrl:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_nitro_v_15_anv15_51_1_18385501dc.png",
    slug: "acer-swift-3-sf314",
    warranty: 12,
  },
];

const ProductCarousel = ({ title, products = sampleProducts, limit = 8 }) => {
  const displayProducts = products.slice(0, limit);

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
    <div className="max-w-7xl mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <CustomSliceProducts
          products={displayProducts}
          loading={false}
          customSetting={defaultSettings}
        />
      </div>
    </div>
  );
};

export default ProductCarousel;
