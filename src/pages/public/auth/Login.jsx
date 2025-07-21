import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { apiLogin } from "~/apis/authApi";
import { useDispatch } from "react-redux";
import { userActions } from "~/stores/slice/userSlice";
import { showToastSuccess } from "~/utils/alert";
import { apiFetchMyInfo } from "~/apis/userApi";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Khi người dùng nhập email → kiểm tra localStorage để auto-fill password
  useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberedUsers") || "{}");
    const savedPassword = remembered[formData.email];
    if (savedPassword) {
      setFormData((prev) => ({ ...prev, password: savedPassword }));
      setRememberMe(true);
    } else {
      setRememberMe(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  }, [formData.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const body = {
        username: formData.email,
        password: formData.password,
      };

      const res = await apiLogin({ body });

      if (res.success && res.token) {
        const token = res.token;
        localStorage.setItem("token", token);

        // Ghi nhớ mật khẩu nếu được chọn
        const remembered = JSON.parse(localStorage.getItem("rememberedUsers") || "{}");
        if (rememberMe) {
          remembered[formData.email] = formData.password;
        } else {
          delete remembered[formData.email];
        }
        localStorage.setItem("rememberedUsers", JSON.stringify(remembered));

        const fetchRes = await apiFetchMyInfo({ token });

        if (fetchRes.code === 200 && fetchRes.data) {
          dispatch(
            userActions.login({
              accessToken: token,
              userData: fetchRes.data,
            })
          );
          showToastSuccess("Đăng nhập thành công!");
          navigate("/");
        } else {
          alert(fetchRes.message || "Không thể lấy thông tin người dùng.");
        }
      } else {
        alert(res.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRememberChange = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (!checked) {
      const remembered = JSON.parse(localStorage.getItem("rememberedUsers") || "{}");
      delete remembered[formData.email];
      localStorage.setItem("rememberedUsers", JSON.stringify(remembered));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#1877F2] mb-8">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1877F2] bg-gray-50"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPasswords ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1877F2] bg-gray-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-[#1877F2]"
                checked={rememberMe}
                onChange={handleRememberChange}
              />
              Ghi nhớ đăng nhập
            </label>
            <a
              href="/reset-password"
              className="text-sm text-[#1877F2] hover:underline font-medium"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#1877F2] hover:bg-[#1666D2] text-white font-semibold py-3 rounded-lg transition-all duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-[#1877F2] hover:underline font-medium">
            Đăng ký ngay
          </a>
        </p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-sm text-gray-500">hoặc</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          className="mt-4 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          onClick={() => {
            const redirectUri = "http://localhost:5173/login/callback";
            const googleClientId = "917950957036-qujvo7u12pod1nemt3jv34l7qlj9dqop.apps.googleusercontent.com";
            const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
            window.location.href = googleLoginUrl;
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
};

export default Login;
