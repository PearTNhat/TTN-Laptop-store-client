import React, { useEffect, useState } from "react";

// Import components con
import ShippingAddress from "./components/ShippingAddress";
import CustomerInfo from "./components/CustomerInfo";
import OrderSummary from "./components/OrderSummary";
import DiscountSection from "./components/DiscountSection";
import PaymentMethod from "./components/PaymentMethod";
import { useSelector } from "react-redux";
// Import dữ liệu giả
import { fakeUserData } from "~/data/fakeOrder";
import { useLocation, useNavigate } from "react-router-dom";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { apiCreateOrder } from "~/apis/orderApi";
import { useDispatch } from "react-redux";
import { cartActions } from "~/stores/slice/cartSlice";
import { apiDeleteCart } from "~/apis/cartApi";
export default function PaymentConfirmation() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, userData } = useSelector((state) => state.user);
  // State quản lý toàn bộ trang
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedShopCoupon, setSelectedShopCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shopDiscountAmount, setShopDiscountAmount] = useState(0);
  const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: `${fakeUserData.firstName} ${fakeUserData.lastName}`,
    phone: fakeUserData.phone,
    email: fakeUserData.email,
    note: "",
  });

  const removeCartItem = async (itemId) => {
    try {
      const response = await apiDeleteCart({ accessToken, pId: itemId });
      if (response.code !== 200) throw new Error(response.message);
      dispatch(cartActions.removeFromCart(itemId));
    } catch (error) {
      showToastError(error.message || "Lỗi xóa sản phẩm");
    }
  };
  const createOrder = async ({ accessToken, body }) => {
    try {
      const res = await apiCreateOrder({ accessToken, body });
      return res;
    } catch (error) {
      showToastError(error.message || "Đặt hàng thất bại");
    }
  };
  const handleCreateOrder = async () => {
    if (!selectedShippingInfo) {
      alert("Vui lòng chọn hoặc thêm địa chỉ giao hàng!");
      return;
    }
    const detailRequest = orderData.items.map((item) => ({
      productDetailId: item.productDetailId,
      quantity: item.quantity,
      productPromotionId: item?.productPromotionId,
    }));
    const body = {
      userId: userData.id,
      addressId: selectedShippingInfo.id,
      detailRequest,
      userPromotionId: selectedCoupon?.id,
      shopPromotionId: selectedShopCoupon?.id,
    };
    const { orderData: receivedOrderData, source } = location.state || {};
    if (selectedPayment === "COD") {
      body.paymentMethod = "COD";
      const res = await createOrder({ accessToken, body });
      if (res?.code === 200) {
        showToastSuccess("Đặt hàng thành công!");
        navigate("/user/orders", { replace: true });
      } else {
        showToastError(res?.message || "Đặt hàng thất bại");
        return;
      }
    } else {
      body.paymentMethod = "MOMO";
      const res = await createOrder({ accessToken, body });
      if (res?.code === 200) {
        window.location.href = res?.data?.payUrl;
      } else {
        showToastError(res?.message || "Đặt hàng thất bại");
        return;
      }
    }
    if (source == "cart-checkout") {
      console.log(receivedOrderData);
      for (const item of receivedOrderData.items) {
        await removeCartItem(item.productDetailId);
      }
    }
    setUserInfo({});
  };

  // --- SỬA LỖI TÍNH TOÁN Ở ĐÂY ---
  useEffect(() => {
    const { orderData: receivedOrderData, source } = location.state || {};

    // Tạo một biến tạm để chứa dữ liệu order đã được chuẩn hóa
    let processedOrder = null;

    if (receivedOrderData && source === "buy-now") {
      const product = receivedOrderData.product;
      processedOrder = {
        items: [
          {
            // Thay id bằng productDetailId nếu có, hoặc một key duy nhất khác
            productDetailId: product.id,
            imageUrl: product.images[0],
            productName: product.title,
            quantity: product.quantity,
            color: product.color,
            ram: product.config.ramValue,
            hardDrive: product.config.hardDriveValue,
            discountPrice: product.discountPrice,
            originalPrice: product.originalPrice, // Giả sử có originalPrice
            productPromotionId: product?.productPromotionId || null, // Nếu có khuyến mãi
          },
        ],
      };
    } else if (receivedOrderData && source === "cart-checkout") {
      // Dữ liệu từ giỏ hàng đã có mảng `items`
      processedOrder = receivedOrderData;
    }
    if (processedOrder && processedOrder.items) {
      const total = processedOrder.items.reduce((acc, item) => {
        return acc + item.discountPrice * item.quantity;
      }, 0);
      setOrderData({
        ...processedOrder,
        totalAmount: total,
      });
    } else {
      // Nếu không có dữ liệu, set state về null
      setOrderData(null);
    }
  }, [location.state]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Xác nhận đơn hàng
          </h1>
          <p className="text-gray-600">
            Vui lòng kiểm tra thông tin trước khi đặt hàng
          </p>
        </div>

        <div className="space-y-6">
          <ShippingAddress
            accessToken={accessToken}
            setSelectedShippingInfo={setSelectedShippingInfo}
          />

          <CustomerInfo
            setUserInfo={setUserInfo}
            userInfo={userInfo}
            selectedShippingInfo={selectedShippingInfo}
          />
          <OrderSummary
            order={orderData}
            discountAmount={discountAmount}
            shopDiscountAmount={shopDiscountAmount}
          />
          <DiscountSection
            accessToken={accessToken}
            orderTotal={orderData?.totalAmount} // Luôn có giá trị đúng
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setDiscountAmount={setDiscountAmount}
            selectedShopCoupon={selectedShopCoupon}
            setSelectedShopCoupon={setSelectedShopCoupon}
            setShopDiscountAmount={setShopDiscountAmount}
          />

          <PaymentMethod
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              onClick={handleCreateOrder}
              // Vô hiệu hóa nút nếu chưa có dữ liệu đơn hàng
              disabled={!orderData}
            >
              {selectedPayment === "COD"
                ? "🚚 HOÀN TẤT ĐẶT HÀNG"
                : "💳 THANH TOÁN VỚI MOMO"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
