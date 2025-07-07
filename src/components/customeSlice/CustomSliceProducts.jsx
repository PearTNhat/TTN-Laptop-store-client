import { useCallback, useState } from "react";
import Slider from "react-slick";
import useWindowSizeCustom from "~/hooks/useWindowSizeCustom";
import NextArrow from "./NextArrow";
import PrevArrow from "./PreviousArrow";
import ProductCard from "../productCard/ProductCard";

function CustomSliceProducts({ customSetting, products, loading }) {
  const [isDragging, setIsDragging] = useState(false);
  const { width } = useWindowSizeCustom();
  const settings = {
    infinite: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: width < 768 ? 2 : width < 900 ? 3 : 4,
    slidesToScroll: width < 768 ? 2 : width < 900 ? 3 : 4,
    ...customSetting,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
  };
  const handleClick = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isDragging]
  );

  return (
    <Slider {...settings}>
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="mt-4">
              <div className="p-3 mb-3 mx-3 bg-gray-200 animate-pulse rounded-2xl h-96"></div>
            </div>
          ))
        : products.map((item) => (
            <div key={item._id} className="mt-4">
              <div className="p-3 mb-3">
                <ProductCard product={item} onClickLink={handleClick} />
              </div>
            </div>
          ))}
    </Slider>
  );
}

export default CustomSliceProducts;
