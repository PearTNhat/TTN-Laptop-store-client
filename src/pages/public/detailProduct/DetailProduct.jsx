import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

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
import CommentContainer from "~/components/comments/CommentContainer";
import RatingContainer from "./components/RatingContainer";
import { apiGetDetailProduct } from "~/apis/productApi";
import { apiCreateCart } from "~/apis/cartApi";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { apiGetComments, apiGetRatingProductDetailId } from "~/apis/commentApi";
import { fetchCart } from "~/stores/action/cart";
import { calculateFinalPrice } from "~/utils/promotion";
import PromotionSection from "./components/PromotionSection";

function DetailProduct() {
  const { pId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const descRef = useRef(null);
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.user);
  const [product, setProduct] = useState({});
  const [productDetails, setProductDetails] = useState([]);
  const [colorProduct, setColorProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [fetchCommentAgain, setFetchCommentAgain] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [finalPriceInfo, setFinalPriceInfo] = useState({
    finalPrice: 0,
    discountAmount: 0,
    appliedPromotion: {},
  });
  // const [stompClient, setStompClient] = useState(null);
  // const [connected, setConnected] = useState(false);
  const isOutOfStock = !colorProduct?.quantity || colorProduct?.quantity === 0;
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const getComments = async (pId) => {
    try {
      const response = await apiGetComments({ pId });
      if (response.code !== 200) {
        showToastError(response.message);
      } else {
        setComments(response.data);
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi tải bình luận");
    }
  };
  const getRatings = async ({ productDetailId }) => {
    try {
      const params = {
        productDetailId: productDetailId,
        page: 1,
        size: 10,
      };
      const response = await apiGetRatingProductDetailId({ ...params });
      if (response.code !== 200) {
        showToastError(response.message);
      } else {
        setRatings(response.data.content);
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi tải đánh giá");
    }
  };
  // ✨ Hàm xử lý khi người dùng chọn/bỏ chọn voucher
  const handleApplyPromotion = (promotion) => {
    setSelectedPromotion(promotion);
  };
  const handleBuyNow = async () => {
    if (isOutOfStock) {
      showToastError("Sản phẩm này hiện đã hết hàng.");
      return;
    }
    if (!accessToken) {
      showToastError("Vui lòng đăng nhập để mua hàng.");
      return;
    }
    const orderData = {
      product: {
        ...colorProduct,
        quantity,
        discountPrice: finalPriceInfo?.finalPrice,
        productPromotionId: selectedPromotion?.id,
        discountAmount: finalPriceInfo?.discountAmount,
      },
      type: "buy-now",
    };
    navigate("/checkout", {
      state: {
        orderData: orderData,
        source: "buy-now",
      },
    });
  };
  const handleAddToCart = async () => {
    if (!accessToken) {
      showToastError("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    const res = await apiCreateCart({
      accessToken,
      productDetailId: colorProduct.id,
      quantity,
      productPromotionId: selectedPromotion?.id || null,
    });
    if (res.code !== 200) {
      showToastError(res.message);
    } else {
      showToastSuccess("Thêm vào giỏ hàng thành công!");
      dispatch(fetchCart({ accessToken }));
    }
  };
  // ////////Description HTML cleanup
  const removeSpecificElements = (htmlString) => {
    if (!htmlString) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    // Remove the .btn-show-hide div that contains the SVG
    const btnShowHideDiv = doc.querySelector(".btn-show-hide");
    if (btnShowHideDiv) {
      btnShowHideDiv.remove();
    }
    return doc.body.innerHTML;
  };
  const cleanedHtml = removeSpecificElements(product?.description);
  const sanitizedDescription = DOMPurify.sanitize(cleanedHtml);
  /////////////////////////////////////////
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await apiGetDetailProduct({ pId });
        if (response.code !== 200) {
          showToastError(response.message);
          // Nếu sản phẩm không tồn tại, redirect về trang sản phẩm
          if (
            response.code === 404 ||
            response.message.includes("không tồn tại") ||
            response.message.includes("not found")
          ) {
            showToastError("Sản phẩm không tồn tại hoặc đã bị xóa!");
            navigate("/products", { replace: true });
            return;
          }
        } else {
          setProduct(response.data);
          setProductDetails(response?.data?.productDetails);
        }
      } catch (error) {
        showToastError(
          error.message || "Có lỗi xảy ra khi tải dữ liệu sản phẩm"
        );
        // Nếu có lỗi network hoặc server error, cũng redirect về trang sản phẩm
        if (error.status === 404 || error.message.includes("404")) {
          showToastError("Sản phẩm không tồn tại!");
          navigate("/products", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (pId) {
      fetchProduct();
    }
  }, [pId, navigate]);
  useEffect(() => {
    if (!colorProduct.id) return;
    getComments(colorProduct.id);
    getRatings({ productDetailId: colorProduct.id });
  }, [colorProduct.id, fetchCommentAgain, accessToken]);
  useEffect(() => {
    if (colorProduct) {
      const priceInfo = calculateFinalPrice(colorProduct.originalPrice, [
        selectedPromotion || {},
      ]);
      setFinalPriceInfo(priceInfo);
    }
  }, [colorProduct, selectedPromotion]);
  useEffect(() => {
    // Chỉ chạy khi currentParams.pId thay đổi hoặc productDetails có dữ liệu
    if (!productDetails.length) return;

    // Nếu không có pId trong URL, chọn sản phẩm đầu tiên
    if (!currentParams.pId) {
      const firstProduct = productDetails[0];
      setColorProduct(firstProduct);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("pId", firstProduct.id);
        return newParams;
      });
      return;
    }
    // Tìm sản phẩm theo pId
    const foundProduct = productDetails.find(
      (detail) => detail.id == currentParams.pId
    );

    if (foundProduct) {
      setColorProduct(foundProduct);
    } else {
      showToastError("Biến thể sản phẩm không tồn tại!");
      const firstProduct = productDetails[0];
      setColorProduct(firstProduct);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("pId", firstProduct.id);
        return newParams;
      });
    }
  }, [currentParams.pId, productDetails, setSearchParams]);
  useEffect(() => {
    const element = descRef.current;
    if (element) {
      setTimeout(() => {
        const isOverflowing = element.scrollHeight > element.clientHeight;
        setIsClamped(isOverflowing);
      }, 300);
    }
  }, [product, isReadMore]);
  // useEffect(() => {
  //   if (selectedPromotion?.usageLimit == null) return;
  //   if (selectedPromotion && quantity > selectedPromotion.usageLimit) {
  //     setSelectedPromotion(null);
  //   }
  // }, [quantity, selectedPromotion]);
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi filter thay đổi
  }, []);

  useEffect(() => {
    // Tạo một client STOMP mới
    const client = new Client({
      // Dùng SockJS làm lớp transport
      webSocketFactory: () => new SockJS("https://dev.api.mylaptopshop.me/ws"), // URL đến endpoint WebSocket của Spring Boot
      // Bật debug để xem log trong consol
      debug: (str) => {
        console.log(str);
      },
      // Kết nối lại sau 5 giây nếu bị mất kết nối
      reconnectDelay: 5000,
      connectHeaders: {
        // login: 'user',
        // passcode: 'password',
      },
    });
    // Xử lý khi kết nối thành công
    client.onConnect = (frame) => {
      console.log("Connected: " + frame);
      // setConnected(true);
      // Đăng ký (subscribe) vào một topic để nhận message từ server
      // Ví dụ: server gửi message đến topic '/topic/public'
      // client.subscribe("/topic/public", (message) => {
      //   const receivedMessage = JSON.parse(message.body);
      //   setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      // });
    };

    // Xử lý lỗi
    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };
    // Kích hoạt kết nối
    client.activate();
    // Lưu client vào state
    // setStompClient(client);
    // Hàm dọn dẹp: ngắt kết nối khi component bị unmount
    return () => {
      if (client) {
        client.deactivate();
        console.log("WebSocket Disconnected");
      }
    };
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần khi component mount
  return (
    <div className=" min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-md">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Đang tải thông tin sản phẩm...
            </p>
          </div>
        </div>
      ) : !product?.id ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sản phẩm không tồn tại
            </h2>
            <p className="text-gray-600 mb-6">
              Sản phẩm bạn tìm kiếm không còn khả dụng hoặc đã bị xóa.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay về trang sản phẩm
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Breadcrumb Section */}
          <div className="py-6 bg-white shadow-sm border-b border-gray-200">
            <div className="container">
              <Breadcrumbs title={colorProduct?.title} />
            </div>
          </div>

          <div className="container py-10">
            {/* Main Product Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Cột ảnh sản phẩm */}
                <div className="flex flex-col lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                  <ProductImageGallery images={colorProduct?.images || []} />
                  <div className="mt-10">
                    <PromotionSection
                      productDetailId={colorProduct.id}
                      originalPrice={colorProduct.originalPrice}
                      onApplyPromotion={handleApplyPromotion}
                      selectedPromotionCode={selectedPromotion?.code}
                    />
                  </div>
                </div>

                {/* Cột thông tin sản phẩm */}
                <div className="lg:col-span-3 p-8">
                  {/* Product Info Component */}
                  <ProductInfo
                    product={product}
                    colorProduct={colorProduct}
                    totalRating={colorProduct.totalRating || 0}
                    countRating={ratings.length}
                  />
                  {/* Product Price Component */}
                  <ProductPrice
                    originalPrice={colorProduct?.originalPrice}
                    finalPrice={finalPriceInfo.finalPrice}
                    quantity={colorProduct?.quantity}
                    soldQuantity={colorProduct?.soldQuantity}
                  />
                  <div className="space-y-8">
                    {/* Color Selector Component */}
                    <ColorSelector
                      product={productDetails}
                      colorProduct={colorProduct}
                      setColorProduct={setColorProduct}
                      setSearchParams={setSearchParams}
                    />

                    {/* Quantity Selector Component */}
                    <QuantitySelector
                      quantity={quantity}
                      setQuantity={setQuantity}
                      max={colorProduct?.quantity}
                    />
                  </div>

                  {/* Action Buttons Component */}
                  <ActionButtons
                    handleBuyNow={handleBuyNow}
                    handleAddToCart={handleAddToCart}
                    isOutOfStock={isOutOfStock}
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
                      {/* The main content div */}
                      <div
                        ref={descRef}
                        className={`prose max-w-none transition-all duration-500 text-gray-700 ${
                          !isReadMore ? "line-clamp-[15]" : ""
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: sanitizedDescription, // Use the sanitized HTML
                        }}
                      />

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
                <DetailInfo configs={colorProduct?.config} />
              </div>
            </div>
            <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2">
                <h2 className="font-bold text-2xl flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  Đánh giá sản phẩm
                </h2>
              </div>

              <div className="p-6">
                <RatingContainer
                  ratings={ratings}
                  totalRating={colorProduct.totalRating}
                />
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
                <CommentContainer
                  productDetailId={colorProduct.id}
                  setFetchCommentAgain={setFetchCommentAgain}
                  comments={comments}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailProduct;
