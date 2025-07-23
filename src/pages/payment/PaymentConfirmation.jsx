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

export default function PaymentConfirmation() {
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.user);
  // State quản lý toàn bộ trang
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: `${fakeUserData.firstName} ${fakeUserData.lastName}`,
    phone: fakeUserData.phone,
    email: fakeUserData.email,
    note: "",
  });
  const handleCreateOrder = () => {
    if (!selectedShippingInfo) {
      alert("Vui lòng chọn hoặc thêm địa chỉ giao hàng!");
      return;
    }

    const finalOrderData = {
      shippingAddress: selectedShippingInfo,
      customerInfo: userInfo,
      order: orderData,
      paymentMethod: selectedPayment,
      coupon: selectedCoupon,
      discountAmount: discountAmount,
      finalTotal: orderData?.totalAmount - discountAmount,
    };

    console.log("--- SUBMITTING ORDER ---", finalOrderData);

    if (selectedPayment === "COD") {
      alert("Đơn hàng đã được tạo thành công! Cảm ơn bạn đã mua sắm.");
    } else {
      alert("Bạn sẽ được chuyển hướng đến trang thanh toán Momo...");
      // window.location.href = '...momo_payment_url...';
    }
  };
  useEffect(() => {
    const { orderData: receivedOrderData, source } = location.state || {};
    console.log("Received order data:", receivedOrderData, "Source:", source);
    if (receivedOrderData && source === "buy-now") {
      // Chuyển đổi dữ liệu từ buy-now thành format order
      const product = receivedOrderData.product;
      const formattedOrder = {
        items: [
          {
            id: product.id,
            imageUrl: product.images[0],
            productName: product.title,
            quantity: product.quantity,
            color: product.color,
            ram: product.config.ramValue,
            hardDrive: product.config.hardDriveValue,
            discountPrice: product.discountPrice,
            originalPrice: product.discountPrice,
          },
        ],
      };
      setOrderData(formattedOrder);
    } else if (receivedOrderData && source === "cart-checkout") {
      // Dữ liệu từ cart đã được format sẵn
      setOrderData(receivedOrderData);
    }
  }, [location.state]);
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
            addresses={fakeUserData.addresses}
            setSelectedShippingInfo={setSelectedShippingInfo}
          />

          <CustomerInfo
            setUserInfo={setUserInfo}
            userInfo={userInfo}
            selectedShippingInfo={selectedShippingInfo}
          />

          <OrderSummary order={orderData} discountAmount={discountAmount} />

          <DiscountSection
            accessToken={accessToken}
            orderTotal={orderData?.totalAmount}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setDiscountAmount={setDiscountAmount}
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
