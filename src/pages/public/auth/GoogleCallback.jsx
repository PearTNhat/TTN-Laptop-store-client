import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "~/stores/slice/userSlice";
import { apiLoginWithGoogle } from "~/apis/authApi"; 
import { apiFetchMyInfo } from "~/apis/userApi"; // ✅ để lấy info user
import { showToastSuccess, showToastError } from "~/utils/alert";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        showToastError("Thiếu mã xác thực từ Google.");
        navigate("/login");
        return;
      }

      try {
        const redirectUri = "http://localhost:5173/login/callback"; // ✅ URI phải khớp Google Developer Console

        // Gọi API backend để đổi code lấy access token
        const res = await apiLoginWithGoogle({ code, redirectUri });

        if (res.success && res.token) {
          localStorage.setItem("token", res.token);

          // Lấy thông tin người dùng
          const fetchRes = await apiFetchMyInfo({ token: res.token });
          if (fetchRes.code === 200 && fetchRes.data) {
            dispatch(
              userActions.login({
                accessToken: res.token,
                userData: fetchRes.data,
              })
            );
            showToastSuccess("Đăng nhập Google thành công!");
            navigate("/");
          } else {
            throw new Error(fetchRes.message || "Không thể lấy thông tin người dùng.");
          }
        } else {
          throw new Error(res.message || "Đăng nhập Google thất bại.");
        }
      } catch (error) {
        showToastError(error.message || "Có lỗi xảy ra.");
        navigate("/login");
      }
    };

    handleGoogleLogin();
  }, [navigate, dispatch]);

  return <div className="p-4 text-center">Đang xử lý đăng nhập Google...</div>;
};

export default GoogleCallback;
