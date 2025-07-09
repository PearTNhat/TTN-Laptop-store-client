import CustomSliceProducts from "~/components/customeSlice/CustomSliceProducts";

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
// Component có thể nhận type để hiển thị các loại sản phẩm khác nhau
const ProductCarousel = ({ title, products }) => {
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
