import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiChangePassword } from "~/apis/authApi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkError, setCheckError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const onSubmit = async (data) => {
    if (step === 1) {
      setLoading(true);
      setCheckError("");
      // ✅ Kiểm tra mật khẩu hiện tại
      const res = await apiChangePassword({
        oldPassword: data.currentPassword,
        newPassword: data.currentPassword, // fake để xác thực
      });
      setLoading(false);
      if (!res.success) {
        setCheckError("Mật khẩu hiện tại không chính xác");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["newPassword", "confirmPassword"]);
      if (!valid) return;
      if (data.newPassword === data.currentPassword) {
        setCheckError("Mật khẩu mới phải khác mật khẩu hiện tại");
        return;
      }
      setCheckError("");
      setStep(3);
    } else {
      // ✅ Gọi API thật để đổi mật khẩu
      setLoading(true);
      const res = await apiChangePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setLoading(false);
      if (res.success) {
        setSuccess(true);
      } else {
        setCheckError(res.message || "Đổi mật khẩu thất bại");
      }
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* Bước UI */}
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
                  ? "Xác thực"
                  : stepNumber === 2
                  ? "Mật khẩu mới"
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

      {/* Thông báo lỗi */}
      {checkError && (
        <p className="text-red-500 text-sm mb-4 text-center">{checkError}</p>
      )}

      {/* Success UI */}
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
          <h3 className="text-xl font-bold mb-2">Đổi mật khẩu thành công!</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Bước 1 */}
          {step === 1 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Xác thực mật khẩu</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    {...register("currentPassword", {
                      required: "Vui lòng nhập mật khẩu hiện tại",
                    })}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword("current")}
                    className="absolute right-2 top-2 text-gray-500"
                  >
                    {showPasswords.current ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bước 2 */}
          {step === 2 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Tạo mật khẩu mới</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    {...register("newPassword", {
                      required: "Vui lòng nhập mật khẩu mới",
                      minLength: {
                        value: 8,
                        message: "Ít nhất 8 ký tự",
                      },
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) || "Phải có ít nhất 1 chữ hoa",
                        hasNumber: (value) =>
                          /[0-9]/.test(value) || "Phải có ít nhất 1 số",
                      },
                    })}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword("new")}
                    className="absolute right-2 top-2 text-gray-500"
                  >
                    {showPasswords.new ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nhập lại mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩu",
                      validate: (value) =>
                        value === newPassword || "Mật khẩu xác nhận không khớp",
                    })}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword("confirm")}
                    className="absolute right-2 top-2 text-gray-500"
                  >
                    {showPasswords.confirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bước 3 */}
          {step === 3 && (
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold mb-4">Xác nhận đổi mật khẩu</h2>
              <p className="mb-4">Bạn có chắc chắn muốn đổi mật khẩu?</p>
              <div className="bg-gray-50 p-4 rounded text-left">
                <p className="text-sm">
                  <span className="font-medium">Thời gian:</span>{" "}
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border rounded text-gray-700"
                disabled={loading}
              >
                Quay lại
              </button>
            )}
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ml-auto ${
                step === 3 ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : step === 3 ? "Hoàn tất" : "Tiếp tục"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
