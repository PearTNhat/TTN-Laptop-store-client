import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "./Register_form";
import RegisterOTP from "./Register_OTP";
import { apiSendOtpRegister, apiRegister } from "~/apis/authApi";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiSendOtpRegister(formData.username);
      if (res.code === 200) {
        setSuccess(`Đã gửi mã OTP đến ${formData.username}`);
        setStep(2);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gửi OTP thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đủ 6 số OTP!");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiRegister({ ...formData, otpCode });
      console.log("📦 API Response:", res); // log phản hồi từ API

      if (res.code === 200) {
        setSuccess("Đăng ký thành công!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.error("❌ API Error:", error); // log lỗi chi tiết
      console.error("📜 API Error Response:", error.response?.data); // log body trả về từ server
      setError(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {step === 1 && (
          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSendOtp}
            isSubmitting={isSubmitting}
            error={error}
            success={success}
          />
        )}
        {step === 2 && (
          <RegisterOTP
            otp={otp}
            setOtp={setOtp}
            otpRefs={otpRefs}
            onSubmit={handleRegister}
            isSubmitting={isSubmitting}
            error={error}
            success={success}
          />
        )}
        <p className="text-center text-sm text-gray-600 mt-6">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-[#1877F2] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
