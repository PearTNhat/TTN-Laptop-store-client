import { data } from "autoprefixer";
import { axiosPrivate, http } from "~/utils/http";

export const apiLogin = async ({ body }) => {
  try {
    const config = {
      withCredentials: true
    }
    const { data } = await http.post("/auth/login", body, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
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

export const apiChangePassword = async ({ oldPassword, newPassword, accessToken }) => {
  try {
    const encodedOldPassword = encodeURIComponent(oldPassword);
    const encodedNewPassword = encodeURIComponent(newPassword);
    
    const response = await http.put(
      `users/change-password?oldPassword=${encodedOldPassword}&newPassword=${encodedNewPassword}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("API response:", response.data);

    if (response.data?.success || response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Đổi mật khẩu thành công!"
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Đổi mật khẩu thất bại"
      };
    }
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 
              error.message || 
              "Không thể kết nối máy chủ"
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
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối khi đặt lại mật khẩu.",
    };
  }
};

export const apiRefreshToken = async () => {
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

// ✅ 1. Gửi OTP khi đăng ký
export const apiSendOtpRegister = async (email) => {
  try {
    const res = await http.get(`/auth/send-otp`, {
      params: { mail: email }
    });
    // Trả nguyên format của backend { code, message, ... }
    return res.data;
  } catch (error) {
    return {
      code: 500,
      message: error.response?.data?.message || "Lỗi kết nối khi gửi OTP."
    };
  }
};

// ✅ 2. Đăng ký tài khoản (sau khi nhập OTP)
export const apiRegister = async ({ firstName, lastName, username, password, otpCode }) => {
  try {
    const res = await http.post(`/users/create`, {
      firstName,
      lastName,
      username,
      password,
      otpCode
    });
    // Trả nguyên format { code, message, ... }
    return res.data;
  } catch (error) {
    return {
      code: 500,
      message: error.response?.data?.message || "Lỗi kết nối khi đăng ký."
    };
  }
};