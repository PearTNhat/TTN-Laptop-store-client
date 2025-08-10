import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "~/stores/slice/userSlice";
import { apiLoginWithGoogle } from "~/apis/authApi"; 
import { apiFetchMyInfo } from "~/apis/userApi"; 
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
        const redirectUri = "http://localhost:5173/login/callback";

        const res = await apiLoginWithGoogle({ code, redirectUri });
        console.log("response: ", res);

        if (res.success && res.token) {
          const fetchRes = await apiFetchMyInfo({ accessToken: res.token });

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