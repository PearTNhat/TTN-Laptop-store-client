import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiChangePassword } from "~/apis/authApi";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { accessToken } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("data: ",data)
    console.log("Current accessToken:", accessToken);
    setLoading(true);
    setError("");

    try {
      const result = await apiChangePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        accessToken,
      });
      console.log("result: ",result)

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 3000);
      } else {
        setError(result.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu</h1>

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
          <p>Bạn sẽ được chuyển về trang chủ trong giây lát...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                {...register("currentPassword")}
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword")}
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword")}
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;