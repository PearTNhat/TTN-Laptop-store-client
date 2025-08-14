import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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
import { apiGetDetailProduct } from "~/apis/productApi";
import { apiCreateCart } from "~/apis/cartApi";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { apiGetComments } from "~/apis/commentApi";
import { fetchCart } from "~/stores/action/cart";
import { calculateFinalPrice } from "~/utils/promotion";
import PromotionSection from "./components/PromotionSection";

// ✨ Import the new ToggleIcon component
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
  const [isClamped, setIsClamped] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [fetchCommentAgain, setFetchCommentAgain] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [finalPriceInfo, setFinalPriceInfo] = useState({
    finalPrice: 0,
    discountAmount: 0,
    appliedPromotion: {},
  });
  const isOutOfStock = !colorProduct?.quantity || colorProduct?.quantity === 0;
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const getDetailProduct = async (pId) => {
    try {
      const response = await apiGetDetailProduct({ pId });
      if (response.code !== 200) {
        showToastError(response.message);
      } else {
        setProduct(response.data);
        setProductDetails(response?.data?.productDetails);
        if (
          response?.data?.productDetails?.length > 0 &&
          currentParams.pId === ""
        ) {
          setColorProduct(response.data.productDetails[0]);
          setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("pId", response.data.productDetails[0].id);
            return newParams;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const getComments = async (pId) => {
    try {
      const response = await apiGetComments({ pId });
      if (response.code !== 200) {
        showToastError(response.message);
      } else {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
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
    getDetailProduct(pId);
  }, [pId]);
  useEffect(() => {
    if (!colorProduct.id) return;
    getComments(colorProduct.id);
  }, [colorProduct.id, fetchCommentAgain, accessToken]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);
  useEffect(() => {
    if (colorProduct) {
      const priceInfo = calculateFinalPrice(colorProduct.originalPrice, [
        selectedPromotion || {},
      ]);
      setFinalPriceInfo(priceInfo);
    }
  }, [colorProduct, selectedPromotion]);
  useEffect(() => {
    if (colorProduct && currentParams.pId == colorProduct?.id) return;
    let found = false;
    for (const detail of productDetails) {
      console.log("_________________", detail.id, currentParams.pId);
      if (detail.id == currentParams.pId) {
        setColorProduct(detail);
        found = true;
      }
    }
    if (!found) {
      setColorProduct({});
    }
  }, [currentParams, colorProduct]);
  useEffect(() => {
    const element = descRef.current;
    if (element) {
      setTimeout(() => {
        const isOverflowing = element.scrollHeight > element.clientHeight;
        setIsClamped(isOverflowing);
      }, 300);
    }
  }, [product, isReadMore]);
  useEffect(() => {
    if (selectedPromotion && quantity > selectedPromotion.usageLimit) {
      setSelectedPromotion(null);
    }
  }, [quantity]);
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
            <div className="flex flex-col lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <ProductImageGallery images={colorProduct?.images || []} />
              <div className="mt-10">
                <PromotionSection
                  accessToken={accessToken}
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
              totalRating={productDetails?.totalRating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
