import React, { useState } from "react";

// Import components con
import ShippingAddress from "./components/ShippingAddress";
import CustomerInfo from "./components/CustomerInfo";
import OrderSummary from "./components/OrderSummary";
import DiscountSection from "./components/DiscountSction";
import PaymentMethod from "./components/PaymentMethod";

// Import dữ liệu giả
import { fakeUserData, fakeOrder } from "~/data/fakeOrder";

export default function PaymentConfirmation() {
  // State quản lý toàn bộ trang
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [selectedCoupon, setSelectdCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
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
      order: fakeOrder,
      paymentMethod: selectedPayment,
      coupon: selectedCoupon,
      discountAmount: discountAmount,
      finalTotal: fakeOrder.totalAmount - discountAmount,
    };

    console.log("--- SUBMITTING ORDER ---", finalOrderData);

    if (selectedPayment === "COD") {
      alert("Đơn hàng đã được tạo thành công! Cảm ơn bạn đã mua sắm.");
    } else {
      alert("Bạn sẽ được chuyển hướng đến trang thanh toán Momo...");
      // window.location.href = '...momo_payment_url...';
    }
  };

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

          <OrderSummary order={fakeOrder} discountAmount={discountAmount} />

          <DiscountSection
            orderTotal={fakeOrder.totalAmount}
            selectedCoupon={selectedCoupon}
            setSelectdCoupon={setSelectdCoupon}
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
