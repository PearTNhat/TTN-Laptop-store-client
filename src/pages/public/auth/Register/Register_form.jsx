import React, { useState } from "react";

const RegisterForm = ({ formData, setFormData, onSubmit, isSubmitting, error, success }) => {
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-[#1877F2] mb-2 text-center">Đăng ký</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-gray-700">Họ</label>
          <input
            name="firstName"
            placeholder="Nhập họ của bạn"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-gray-700">Tên</label>
          <input
            name="lastName"
            placeholder="Nhập tên của bạn"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-gray-700">Email</label>
          <input
            name="username"
            type="email"
            placeholder="email@example.com"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div className="space-y-1 relative">
          <label className="block text-gray-700">Mật khẩu</label>
          <div className="relative">
            <input
              name="password"
              type={showPasswords.password ? "text" : "password"}
              placeholder="Ít nhất 8 ký tự"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
              required
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("password")}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.password ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        
        <div className="space-y-1 relative">
          <label className="block text-gray-700">Xác nhận mật khẩu</label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showPasswords.confirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
              required
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("confirmPassword")}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1877F2] text-white font-semibold py-2 rounded-lg hover:bg-[#1666D2] transition"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi OTP"}
        </button>
      </form>
      
      <div className="text-center text-sm text-gray-600 mt-4">
        Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-[#1877F2] hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-[#1877F2] hover:underline">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
};

export default RegisterForm;