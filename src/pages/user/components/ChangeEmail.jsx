import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiSendOtpChangeEmail, apiChangeEmail } from "~/apis/userApi";

const ChangeEmail = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const newEmail = watch("newEmail");

  useEffect(() => {
    if (success) {
      toast.success("🎉 Đổi email thành công!", { autoClose: 2000 });
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChangeOtp = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleKeyDownOtp = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (step === 1) {
        const res = await apiSendOtpChangeEmail(data.newEmail);
        if (res.code === 200) {
          toast.success("📩 Mã xác nhận đã được gửi đến email!");
          setStep(2);
        } else {
          toast.error(res.message);
        }
      } else if (step === 2) {
        const otpCode = otp.join("");
        if (otpCode.length < 6 || !/^\d{6}$/.test(otpCode)) {
          toast.error("Vui lòng nhập đầy đủ 6 số OTP hợp lệ");
          return;
        }
        setStep(3);
      } else if (step === 3) {
        const res = await apiChangeEmail({
          newEmail: data.newEmail,
          otpCode: otp.join(""),
        });
        if (res.code === 200) {
          setSuccess(true);
        } else {
          toast.error(res.message);
        }
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <ToastContainer position="top-center" />

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex justify-between relative pb-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center z-10" style={{ width: "calc(100%/3)" }}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step >= num ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {num}
              </div>
              <span className="text-sm text-center">
                {num === 1 ? "Email mới" : num === 2 ? "Xác minh OTP" : "Hoàn tất"}
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

      {/* Success */}
      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
            ✅
          </div>
          <h3 className="text-xl font-bold mb-2 text-green-700">Đổi email thành công!</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Nhập email mới</h2>
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
                <p className="text-red-500 text-sm mt-1">{errors.newEmail.message}</p>
              )}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-center">Nhập mã xác nhận</h2>
              <p className="text-gray-600 text-sm text-center mb-4">
                Vui lòng nhập 6 chữ số đã được gửi đến <strong>{newEmail}</strong>
              </p>
              <div className="flex justify-center gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChangeOtp(e, index)}
                    onKeyDown={(e) => handleKeyDownOtp(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold mb-4">Xác nhận đổi email</h2>
              <p className="mb-4">Bạn có chắc chắn muốn đổi sang email sau?</p>
              <div className="bg-gray-50 p-4 rounded text-left">
                <p className="text-sm"><strong>Email mới:</strong> {newEmail}</p>
                <p className="text-sm"><strong>Thời gian:</strong> {new Date().toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
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
              disabled={loading}
              className={`px-4 py-2 rounded text-white ml-auto flex items-center gap-2 ${
                step === 3 ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : step === 3 ? "Hoàn tất" : "Tiếp tục"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangeEmail;
