import React from "react";
import Slider from "react-slick";
import useWindowSizeCustom from "~/hooks/useWindowSizeCustom";
import NextArrow from "~/components/customeSlice/NextArrow";
import PrevArrow from "~/components/customeSlice/PreviousArrow";
import {
  FaLaptopCode,
  FaBriefcase,
  FaApple,
  FaGamepad,
  FaGraduationCap,
  FaBuilding,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Laptop Gaming",
    description: "Hiệu năng cao cho game thủ",
    icon: <FaGamepad size={48} />,
    link: "/san-pham/gaming",
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-50 to-pink-50",
    count: "120+ sản phẩm",
  },
  {
    name: "Laptop Văn phòng",
    description: "Tối ưu cho công việc",
    icon: <FaBriefcase size={48} />,
    link: "/san-pham/van-phong",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    count: "85+ sản phẩm",
  },
  {
    name: "MacBook",
    description: "Thiết kế đẳng cấp Apple",
    icon: <FaApple size={48} />,
    link: "/san-pham/macbook",
    gradient: "from-gray-700 to-gray-900",
    bgGradient: "from-gray-50 to-gray-100",
    count: "45+ sản phẩm",
  },
  {
    name: "Laptop Học tập",
    description: "Giá rẻ cho sinh viên",
    icon: <FaGraduationCap size={48} />,
    link: "/san-pham/hoc-tap",
    gradient: "from-green-500 to-teal-500",
    bgGradient: "from-green-50 to-teal-50",
    count: "95+ sản phẩm",
  },
  {
    name: "Laptop Doanh nghiệp",
    description: "Bảo mật và ổn định",
    icon: <FaBuilding size={48} />,
    link: "/san-pham/doanh-nghiep",
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "from-purple-50 to-indigo-50",
    count: "60+ sản phẩm",
  },
  {
    name: "Workstation",
    description: "Chuyên nghiệp cao cấp",
    icon: <FaLaptopCode size={48} />,
    link: "/san-pham/workstation",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    count: "35+ sản phẩm",
  },
];

const CategoryCard = ({ category }) => {
  return (
    <Link to={category.link} className="group block">
      <div
        className={`relative bg-gradient-to-br ${category.bgGradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/50 overflow-hidden h-full`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>

        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${category.gradient} text-white rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          {category.icon}
        </div>

        {/* Content */}
        <div className="relative">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
            {category.description}
          </p>
        </div>

        {/* Hover effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
        ></div>
      </div>
    </Link>
  );
};

const CategoryCarousel = () => {
  const { width } = useWindowSizeCustom();

  const settings = {
    infinite: true,
    speed: 500,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: width < 768 ? 1 : width < 1024 ? 2 : 3,
    autoplay: true,
    dots: false,
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Danh mục nổi bật
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Categories Carousel */}
        <div className="relative">
          <Slider {...settings}>
            {categories.map((category) => (
              <div key={category.name} className="px-4">
                <CategoryCard category={category} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
