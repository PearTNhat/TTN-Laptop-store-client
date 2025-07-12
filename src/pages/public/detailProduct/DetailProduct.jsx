import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Import mock data
import { mockProduct } from "~/constants/mockProduct";

// Import utils and components
import Breadcrumbs from "~/components/Breadcrumbs";
import DetailInfo from "./components/DetailInfo";
import { showToastError, showToastSuccess } from "~/utils/alert";
import ProductImageGallery from "./components/ProductImageGallery";
import ProductInfo from "./components/ProductInfo";
import ProductPrice from "./components/ProductPrice";
import ColorSelector from "./components/ColorSelector";
import QuantitySelector from "./components/QuantitySelector";
import ActionButtons from "./components/ActionButtons";
import CommentContainer from "~/components/comments/MockCommentContainer";
import { apiGetDetailProduct } from "~/apis/productApi";
const mockUserData = {
  _id: "user123",
  firstName: "Nguyen",
  lastName: "Van A",
  isLoggedIn: true,
  accessToken: "fake-token-123",
  isAdmin: false,
  avatar: { url: "https://randomuser.me/api/portraits/men/1.jpg" },
};
const fakeComments = [
  {
    _id: "comment1",
    user: {
      _id: "user456",
      firstName: "Minh",
      lastName: "Nguyen",
      avatar: { url: "https://randomuser.me/api/portraits/men/32.jpg" },
    },
    content:
      "Laptop này rất tuyệt vời! Hiệu năng mạnh mẽ, thiết kế đẹp và pin trâu. Rất đáng tiền!",
    createdAt: new Date(Date.now() - 3600 * 1000 * 5), // 5 giờ trước
    rating: 5,
    likes: [mockUserData._id, "user789"],
    replyOnUser: null,
    replies: [
      {
        _id: "reply1",
        user: {
          _id: "user789",
          firstName: "Hà",
          lastName: "Tran",
          avatar: {
            url: "https://randomuser.me/api/portraits/women/44.jpg",
          },
        },
        content: "Mình cũng đang dùng model này, thật sự rất hài lòng!",
        createdAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 giờ trước
        rating: 0,
        likes: [],
        replyOnUser: {
          _id: "user456",
          firstName: "Minh",
          lastName: "Nguyen",
        },
        replies: [],
      },
    ],
  },
  {
    _id: "comment2",
    user: {
      _id: "user789",
      firstName: "Long",
      lastName: "Pham",
      avatar: { url: "https://randomuser.me/api/portraits/men/65.jpg" },
    },
    content:
      "Sản phẩm tốt nhưng giá hơi cao. Tuy nhiên chất lượng xứng đáng với giá tiền.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24), // 1 ngày trước
    rating: 4,
    likes: [mockUserData._id],
    replyOnUser: null,
    replies: [],
  },
  {
    _id: "comment3",
    user: mockUserData, // Comment của user hiện tại
    content:
      "Mình vừa mới mua và test thử, cảm giác rất tốt. Màn hình sắc nét, âm thanh chất lượng.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 12), // 12 giờ trước
    rating: 5,
    likes: ["user456", "user789"],
    replyOnUser: null,
    replies: [],
  },
  {
    _id: "comment4",
    user: {
      _id: "user999",
      firstName: "An",
      lastName: "Vo",
      avatar: { url: "https://randomuser.me/api/portraits/women/68.jpg" },
    },
    content:
      "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả, rất hài lòng!",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48), // 2 ngày trước
    rating: 4,
    likes: [],
    replyOnUser: null,
    replies: [],
  },
];

function DetailProduct() {
  const { pId } = useParams(); // Bạn có thể dùng lại khi tích hợp API
  const descRef = useRef(null);
  const navigate = useNavigate();
  // Giả sử accessToken có tồn tại để test luồng đã đăng nhập
  const accessToken = "fake-access-token";
  const [product, setProduct] = useState({});
  const [productDetails, setProductDetails] = useState([]);
  const [colorProduct, setColorProduct] = useState({});
  const [isClamped, setIsClamped] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const getDetailProduct = async (pId) => {
    try {
      const response = await apiGetDetailProduct({ pId });
      if (response.code !== 200) {
        showToastError(response.message);
      } else {
        setProduct(response.data);
        console.log("daa", response.data);
        setProductDetails(response?.data?.productDetails);
        if (response?.data?.productDetails?.length > 0) {
          setColorProduct(response.data.productDetails[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  // Sử dụng mock data thay vì gọi API
  useEffect(() => {
    // Mock user data để giả lập đăng nhập
    // Giả lập việc fetch dữ liệu
    getDetailProduct(pId);
    // Set màu mặc định
    setComments(fakeComments);
    setTotalRating(4.5);
  }, []);
  useEffect(() => {
    // window.scrollTo(0, 0);
  }, [product]);

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
  console.log("colorProduct:", colorProduct);
  return (
    <div className=" mx-auto p-2 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-md">
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
              <ProductInfo
                product={product}
                colorProduct={colorProduct}
                totalRating={colorProduct.totalRating || 0}
              />
              {/* Product Price Component */}
              <ProductPrice colorProduct={colorProduct} />
              <div className="space-y-8">
                {/* Color Selector Component */}
                <ColorSelector
                  product={productDetails}
                  colorProduct={colorProduct}
                  setColorProduct={setColorProduct}
                />

                {/* Quantity Selector Component */}
                <QuantitySelector
                  colorProduct={colorProduct}
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
                      __html: Array.isArray(product?.description)
                        ? product.description.join("")
                        : product?.description || "",
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
            <DetailInfo configs={colorProduct?.configs} />
          </div>
        </div>
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2">
            <h2 className="font-bold text-2xl flex items-center gap-3">
              <span className="text-2xl">💬</span>
              Đánh giá & Bình luận
            </h2>
          </div>
          <div className="p-6">
            <CommentContainer comments={comments} totalRating={totalRating} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
