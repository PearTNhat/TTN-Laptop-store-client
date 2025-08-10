import React from "react";

const RegisterOTP = ({ otp, setOtp, otpRefs, onSubmit, isSubmitting, error, success }) => {
  const handleChangeOtp = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-[#1877F2] mb-6">Nhập mã OTP</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm text-center">{success}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div className="flex justify-between gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChangeOtp(e, i)}
              ref={(el) => (otpRefs.current[i] = el)}
              className="w-12 h-12 text-center border border-gray-200 rounded-lg text-lg font-medium"
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1877F2] hover:bg-[#1666D2] text-white font-semibold py-3 rounded-lg"
        >
          {isSubmitting ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
        </button>
      </form>
    </>
  );
};

export default RegisterOTP;
