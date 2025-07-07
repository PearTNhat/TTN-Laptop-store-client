import React from "react";
import Slider from "react-slick";

// Banner images với overlay content
const bannerData = [
  {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_1_034dccf1eb.png",
    title: "Laptop Gaming Mới Nhất",
    subtitle: "Trải nghiệm game đỉnh cao với hiệu năng vượt trội",
    buttonText: "Khám phá ngay",
    link: "/san-pham/gaming",
  },
  {
    image:
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_21a36aa570.png",
    title: "MacBook Pro M3 Series",
    subtitle: "Công nghệ tiên tiến, thiết kế hoàn hảo",
    buttonText: "Xem chi tiết",
    link: "/san-pham/macbook",
  },
];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    fade: true,
    cssEase: "linear",
    customPaging: () => (
      <div className="w-3 h-3 bg-white/50 rounded-full hover:bg-white transition-all duration-300"></div>
    ),
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div className="relative w-full mb-16 overflow-hidden rounded-2xl shadow-2xl">
      <Slider {...settings}>
        {bannerData.map((banner, index) => (
          <div key={index} className="relative">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
