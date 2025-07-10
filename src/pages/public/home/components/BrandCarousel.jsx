import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import NextArrow from "~/components/customeSlice/NextArrow";
import PrevArrow from "~/components/customeSlice/PreviousArrow";
import { fakeBrands } from "~/data/fakeData";

// Thêm thông tin bổ sung cho brands
const enrichedBrands = fakeBrands.map((brand, index) => ({
  ...brand,
  description:
    {
      1: "MacBook, iMac chính hãng",
      2: "XPS, Inspiron, Gaming",
      3: "Pavilion, Envy, Omen",
      4: "ROG, ZenBook, VivoBook",
      5: "ThinkPad, IdeaPad, Legion",
      6: "Nitro, Swift, Aspire",
      7: "Gaming, Creator, Business",
      8: "Galaxy Book, Ultra-thin",
    }[brand.id] || "Laptop chất lượng cao",
  productCount: Math.floor(Math.random() * 100) + 50,
  badge: [
    "Premium",
    "Bestseller",
    "Popular",
    "Gaming",
    "Professional",
    "Value",
  ][index % 6],
  color: [
    "from-gray-100 to-gray-200",
    "from-blue-100 to-blue-200",
    "from-cyan-100 to-cyan-200",
    "from-orange-100 to-orange-200",
    "from-purple-100 to-purple-200",
    "from-green-100 to-green-200",
    "from-red-100 to-red-200",
    "from-indigo-100 to-indigo-200",
  ][index % 8],
}));

const BrandCard = ({ brand }) => {
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Premium":
        return "bg-gradient-to-r from-gray-600 to-gray-800";
      case "Bestseller":
        return "bg-gradient-to-r from-blue-500 to-blue-700";
      case "Popular":
        return "bg-gradient-to-r from-cyan-500 to-cyan-700";
      case "Gaming":
        return "bg-gradient-to-r from-red-500 to-red-700";
      case "Business":
        return "bg-gradient-to-r from-gray-700 to-gray-900";
      case "Value":
        return "bg-gradient-to-r from-green-500 to-green-700";
      case "Innovation":
        return "bg-gradient-to-r from-purple-500 to-purple-700";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-700";
    }
  };

  return (
    <div className="group relative px-3">
      <div
        className={`bg-gradient-to-br ${brand.color} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-white/20 backdrop-blur-sm`}
      >
        {/* Badge */}
        <div
          className={`absolute top-4 right-4 ${getBadgeColor(
            brand.badge
          )} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
        >
          {brand.badge}
        </div>

        {/* Logo */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <img
              src={
                brand.logo ||
                `https://logo.clearbit.com/${brand.name.toLowerCase()}.com`
              }
              alt={brand.name}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback 1: Try logo.clearbit.com
                if (!e.target.src.includes("logo.clearbit.com")) {
                  e.target.src = `https://logo.clearbit.com/${brand.name.toLowerCase()}.com`;
                } else {
                  // Fallback 2: Use a placeholder with brand initial
                  e.target.src = `https://ui-avatars.com/api/?name=${brand.name}&background=4F46E5&color=fff&size=48&format=png&font-size=0.33`;
                }
              }}
            />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {brand.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {brand.description}
          </p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    </div>
  );
};

const BrandCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            🏆 Thương hiệu nổi bật
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Brands Carousel */}
        <div className="relative">
          {" "}
          <Slider {...settings}>
            {enrichedBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
