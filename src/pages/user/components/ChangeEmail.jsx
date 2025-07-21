import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const ChangeEmail = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const newEmail = watch("newEmail");
  const otp = watch("otp");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const onSubmit = async (data) => {
    if (step === 1) {
      // TODO: Gửi OTP đến email mới
      console.log("Gửi mã xác nhận đến:", data.newEmail);
      setOtpSent(true);
      setStep(2);
    } else if (step === 2) {
      const valid = await trigger("otp");
      if (valid) {
        setStep(3);
      }
    } else {
      // TODO: Gọi API đổi email
      console.log("Đổi email thành công với:", data);
      setSuccess(true);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="mb-8">
        <div className="flex justify-between relative pb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className="flex flex-col items-center z-10"
              style={{ width: "calc(100%/3)" }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step >= stepNumber
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              <span className="text-sm text-center">
                {stepNumber === 1
                  ? "Email mới"
                  : stepNumber === 2
                  ? "Xác minh OTP"
                  : "Hoàn tất"}
              </span>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300 ${
              step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
            }`}
          ></div>
        </div>
      </div>

      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Đổi email thành công!</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Nhập email mới</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email mới</label>
                <input
                  type="email"
                  {...register("newEmail", {
                    required: "Vui lòng nhập email mới",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.newEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newEmail.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Nhập mã xác nhận</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mã OTP đã gửi đến email</label>
                <input
                  type="text"
                  {...register("otp", {
                    required: "Vui lòng nhập mã xác nhận",
                    minLength: {
                      value: 4,
                      message: "Mã xác nhận phải có ít nhất 4 ký tự",
                    },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold mb-4">Xác nhận đổi email</h2>
              <p className="mb-4">Bạn có chắc chắn muốn đổi sang email sau?</p>
              <div className="bg-gray-50 p-4 rounded text-left">
                <p className="text-sm">
                  <span className="font-medium">Email mới:</span> {newEmail}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Thời gian:</span> {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Quay lại
              </button>
            )}
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ml-auto ${
                step === 3 ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {step === 3 ? "Hoàn tất" : "Tiếp tục"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangeEmail;
