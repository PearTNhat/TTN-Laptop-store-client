import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// Import mock data
import { mockProduct } from "~/constants/mockProduct";

// Import utils and components
import Breadcrumbs from "~/components/Breadcrumbs";
import DetailInfo from "./components/DetailInfo";
import { showToastSuccess } from "~/utils/alert";
import ProductImageGallery from "./components/ProductImageGallery";
import ProductInfo from "./components/ProductInfo";
import ProductPrice from "./components/ProductPrice";
import ColorSelector from "./components/ColorSelector";
import QuantitySelector from "./components/QuantitySelector";
import ActionButtons from "./components/ActionButtons";

function DetailProduct() {
  // const { slug } = useParams(); // Bạn có thể dùng lại khi tích hợp API
  const descRef = useRef(null);
  const navigate = useNavigate();

  // Giả sử accessToken có tồn tại để test luồng đã đăng nhập
  const accessToken = "fake-access-token";

  const [product, setProduct] = useState({});
  const [colorProduct, setColorProduct] = useState({});
  const [isClamped, setIsClamped] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Sử dụng mock data thay vì gọi API
  useEffect(() => {
    // Giả lập việc fetch dữ liệu
    window.scrollTo(0, 0);
    setProduct(mockProduct);

    // Set màu mặc định
    if (mockProduct.colors && mockProduct.colors.length > 0) {
      setColorProduct(mockProduct.colors[0]);
    }
  }, []);

  const handleBuyNow = async () => {
    if (!accessToken) {
      // Logic khi chưa đăng nhập
    }
    showToastSuccess("Chuyển hướng đến trang thanh toán...");
    setTimeout(() => navigate("/user/cart"), 1500);
  };

  const handleAddToCart = async () => {
    if (!accessToken) {
      // Logic khi chưa đăng nhập
    }
    showToastSuccess("Thêm vào giỏ hàng thành công!");
  };

  useEffect(() => {
    const element = descRef.current;
    if (element) {
      // Kiểm tra xem nội dung có bị cắt hay không sau một khoảng trễ nhỏ để DOM render xong
      setTimeout(() => {
        const isOverflowing = element.scrollHeight > element.clientHeight;
        setIsClamped(isOverflowing);
      }, 300);
    }
  }, [product, isReadMore]);

  return (
    <div className="max-w-7xl mx-auto p-2 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-md">
      {/* Breadcrumb Section */}
      <div className="py-6 bg-white shadow-sm border-b border-gray-200">
        <div className="main-container">
          <Breadcrumbs title={product.title?.split("-")[0]} />
        </div>
      </div>

      <div className="main-container py-10">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Cột ảnh sản phẩm */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <ProductImageGallery images={colorProduct?.images || []} />
            </div>

            {/* Cột thông tin sản phẩm */}
            <div className="lg:col-span-3 p-8">
              {/* Product Info Component */}
              <ProductInfo product={product} />
              {/* Product Price Component */}
              <ProductPrice product={product} />

              {/* Features Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 mb-6">
                <div
                  className="prose prose-sm text-gray-700 max-w-none"
                  dangerouslySetInnerHTML={{ __html: product?.features }}
                ></div>
              </div>

              <div className="space-y-8">
                {/* Color Selector Component */}
                <ColorSelector
                  product={product}
                  colorProduct={colorProduct}
                  setColorProduct={setColorProduct}
                />

                {/* Quantity Selector Component */}
                <QuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              </div>

              {/* Action Buttons Component */}
              <ActionButtons
                handleBuyNow={handleBuyNow}
                handleAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>

        {/* Description and Specs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2">
                <h2 className="font-bold text-2xl flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  Mô tả chi tiết sản phẩm
                </h2>
              </div>
              <div className="p-8">
                <div className="relative">
                  <div
                    ref={descRef}
                    className={`prose max-w-none transition-all duration-500 text-gray-700 ${
                      !isReadMore ? "line-clamp-[15]" : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: product?.description?.[0] || "",
                    }}
                  ></div>
                  {(isClamped || isReadMore) && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setIsReadMore(!isReadMore)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        {isReadMore ? "▲ Thu gọn" : "▼ Xem thêm"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="lg:col-span-1">
            <DetailInfo configs={product.configs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
