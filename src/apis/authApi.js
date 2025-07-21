import { axiosPrivate, http } from "~/utils/http";

export const apiLogin = async ({ body }) => {
  try {
    const response = await http.post("/auth/login", body);
    const res = response.data;

    // ✅ Kiểm tra đúng theo backend (code === 200 là thành công)
    if (res?.code === 200 && res?.data) {
      return { success: true, token: res.data };
    } else {
      return {
        success: false,
        message: res?.message || "Đăng nhập thất bại.",
      };
    }
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Lỗi từ máy chủ.",
      };
    }
    return { success: false, message: "Không kết nối được đến máy chủ." };
  }
};


export const apiLoginWithGoogle = async ({ code, redirectUri }) => {
  try {
    const response = await http.post("/auth/google", {
      code,
      redirectUri,
    });
    const res = response.data;

    if (res?.code === 200 && res?.data) {
      return {
        success: true,
        token: res.data, // token trả về từ backend
      };
    } else {
      return {
        success: false,
        message: res.message || "Đăng nhập Google thất bại.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};

export const apiChangePassword = async ({ oldPassword, newPassword }) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await http.put(
      `/users/change-password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`,
      null, 
      config
    );

    const res = response.data;
    if (res?.code === 200) {
      return { success: true, message: res.message };
    } else {
      return { success: false, message: res.message || "Đổi mật khẩu thất bại" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ",
    };
  }
};


// ✅ 1. Gửi OTP đến email
export const apiSendOtpForgotPw = async (email) => {
  try {
    const res = await http.get(`/auth/send-otp-forgot-pw?mail=${email}`);

    if (res?.data?.code === 200) {
      return { success: true, message: res.data.message };
    } else {
      return { success: false, message: res.data?.message || "Không gửi được OTP." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối khi gửi OTP.",
    };
  }
};

// ✅ 2. Xác minh OTP => nhận về resetToken (string)
export const apiVerifyOtp = async ({ email, otp }) => {
  try {
    const res = await http.get(`/auth/verify-otp?otp=${otp}&email=${email}`);

    if (res?.data?.code === 200) {
      return { success: true, resetToken: res.data.data }; // resetToken là chuỗi trong data.data
    } else {
      return { success: false, message: res.data?.message || "Mã OTP không đúng." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối khi xác minh OTP.",
    };
  }
};

// ✅ 3. Đặt lại mật khẩu mới với resetToken
export const apiResetPassword = async ({ email, newPassword, resetToken }) => {
  try {
    const body = { email, newPassword, resetToken };
    const res = await http.post('/auth/reset-password', body);

    if (res?.data?.code === 200) {
      return { success: true, message: res.data.message || "Đặt lại mật khẩu thành công." };
    } else {
      return { success: false, message: res.data?.message || "Đặt lại mật khẩu thất bại." };
    }
};

const apiRefreshToken = async () => {
    try {
        const config = {
            withCredentials: true
        }
        const { data } = await axiosPrivate.get("/auth/refresh-token", config);
        console.log("Refresh token response:", data);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiLogin, apiRefreshToken };