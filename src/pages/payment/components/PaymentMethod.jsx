import React from "react";
import { FaTruck, FaMobile } from "react-icons/fa";

const PaymentMethod = ({ selectedPayment, setSelectedPayment }) => {
  const paymentOptions = [
    {
      value: "COD",
      label: "Thanh toán khi nhận hàng (COD)",
      icon: <FaTruck className="text-green-600" />,
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
    },
    {
      value: "Momo",
      label: "Thanh toán qua ví Momo",
      icon: <FaMobile className="text-pink-600" />,
      description: "Thanh toán nhanh chóng qua ví điện tử",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        💳 Phương thức thanh toán
      </h2>
      <div className="space-y-3">
        {paymentOptions.map((method) => (
          <label
            key={method.value}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedPayment === method.value
                ? "bg-blue-50 border-blue-300 shadow-md"
                : "bg-gray-50 border-gray-200 hover:bg-white hover:shadow-sm"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={selectedPayment === method.value}
              onChange={() => setSelectedPayment(method.value)}
              className="sr-only"
            />
            <div className="flex items-center gap-4 flex-1">
              <div className="text-2xl">{method.icon}</div>
              <div>
                <div className="font-semibold text-gray-800">
                  {method.label}
                </div>
                <div className="text-sm text-gray-600">
                  {method.description}
                </div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                selectedPayment === method.value
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300"
              }`}
            >
              {selectedPayment === method.value && (
                <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
